# Edge Function: obra-transcrever

Transcreve o áudio gravado num registro do app Vistoria de Obra (bucket `obra-fotos`)
com OpenAI Whisper (pt-BR) e fixa o texto em `obra_registros.transcricao`
(e em `descricao`, se o registro estava sem descrição).

## Pré-requisitos
- Colunas em `obra_registros`: `transcricao text`, `transcrito_em timestamptz`, `erro_transcricao text` (ver `schema_obra.sql`).
- Secret `OPENAI_API_KEY` já existente (compartilhada com `analisar-reforma`).

## Deploy
Duplo clique em `deploy-obra-transcrever.bat` (pede login no Supabase na 1ª vez), ou:

```bash
npx supabase@2 login
npx supabase@2 link --project-ref fimmjgdwhifsrrbreche
npx supabase@2 functions deploy obra-transcrever --no-verify-jwt
```

Alternativa sem CLI: Dashboard → Edge Functions → Create → nome `obra-transcrever` → colar `index.ts` → Deploy.

## Chamada (app)
`sb.functions.invoke('obra-transcrever',{body:{registro_id}})` logo após o upload do áudio.
`{forcar:true}` re-transcreve mesmo que já exista texto.
