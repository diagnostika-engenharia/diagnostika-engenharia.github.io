// ═══════════════════════════════════════════════════════════════════════════
// Edge Function: obra-transcrever
//
// Recebe { registro_id }, baixa o áudio do bucket obra-fotos (audio_path do
// registro), transcreve com OpenAI Whisper (pt-BR) e grava em
// obra_registros.transcricao / transcrito_em (ou erro_transcricao).
//
// Secrets (Dashboard → Edge Functions → Secrets):
// - OPENAI_API_KEY  ← obrigatória (a mesma de analisar-reforma)
// SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY são injetadas.
// Deploy: supabase functions deploy obra-transcrever --no-verify-jwt
// ═══════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
const BUCKET = 'obra-fotos'
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  let admin: any = null, registro_id: string | null = null
  try {
    const body = await req.json().catch(() => ({}))
    registro_id = body?.registro_id || null
    if (!registro_id) throw new Error('registro_id obrigatório')

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Não autenticado')

    const url = Deno.env.get('SUPABASE_URL')!
    // Cliente como o usuário: garante que ele enxerga o registro (RLS)
    const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
    const { data: reg, error: eSel } = await asUser.from('obra_registros')
      .select('id,audio_path,descricao,transcricao').eq('id', registro_id).maybeSingle()
    if (eSel) throw new Error('Consulta: ' + eSel.message)
    if (!reg) throw new Error('Registro não encontrado ou sem permissão')
    if (!reg.audio_path || reg.audio_path === 'local') throw new Error('Registro sem áudio')
    if (reg.transcricao && !body?.forcar) return json({ transcricao: reg.transcricao, cache: true })

    // Service role: baixa o áudio e grava o resultado
    admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: blob, error: eDl } = await admin.storage.from(BUCKET).download(reg.audio_path)
    if (eDl || !blob) throw new Error('Download do áudio: ' + (eDl?.message || 'vazio'))
    if (blob.size < 200) throw new Error('Áudio vazio')

    const key = Deno.env.get('OPENAI_API_KEY')
    if (!key) throw new Error('OPENAI_API_KEY não configurada')
    const ext = (reg.audio_path.split('.').pop() || 'webm').toLowerCase()
    const fd = new FormData()
    fd.append('file', blob, `audio.${ext}`)
    fd.append('model', 'whisper-1')
    fd.append('language', 'pt')
    fd.append('response_format', 'json')
    fd.append('prompt', 'Vistoria de obra em condomínio: fachada, pavimento, andaime, pastilha, reboco, infiltração, não conformidade, EPI, capacete, NBR.')
    const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: fd
    })
    if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${(await resp.text()).slice(0, 200)}`)
    const out = await resp.json()
    const texto = String(out.text || '').trim()
    if (!texto) throw new Error('Transcrição vazia')

    const patch: Record<string, unknown> = { transcricao: texto, transcrito_em: new Date().toISOString(), erro_transcricao: null }
    // Fixa no texto da vistoria: se o registro não tem descrição, a transcrição vira a descrição
    if (!(reg.descricao || '').trim()) patch.descricao = texto
    const { error: eUpd } = await admin.from('obra_registros').update(patch).eq('id', registro_id)
    if (eUpd) throw new Error('Gravar: ' + eUpd.message)
    return json({ transcricao: texto, descricao_preenchida: !!patch.descricao })
  } catch (e) {
    const msg = (e as Error).message || String(e)
    console.error('obra-transcrever:', msg)
    try { if (admin && registro_id) await admin.from('obra_registros').update({ erro_transcricao: msg.slice(0, 300) }).eq('id', registro_id) } catch { /* ignora */ }
    return json({ error: msg }, 400)
  }
})
