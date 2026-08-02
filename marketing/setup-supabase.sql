-- setup-supabase.sql
--
-- Rodar UMA vez no Supabase (SQL Editor) antes de fazer o deploy da branch
-- claude/aumentar-volume-pedidos-art-d464f9.
--
-- É idempotente — pode rodar de novo sem quebrar. Todos os blocos usam
-- IF NOT EXISTS ou DROP POLICY IF EXISTS + CREATE POLICY.
--
-- Se a tabela public.solicitacoes_art ainda NÃO existir, o passo 0 cria.
-- Se já existir, o passo 0 é no-op (thanks to IF NOT EXISTS).

-- ═══════════════════════════════════════════════════════════════════════════
-- 0) Tabela base (só cria se ainda não existir)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.solicitacoes_art (
  id BIGSERIAL PRIMARY KEY,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  condominio TEXT NOT NULL,
  endereco TEXT NOT NULL,
  bloco TEXT,
  apto TEXT NOT NULL,
  cidade TEXT,
  metragem NUMERIC,
  descricao TEXT NOT NULL,
  previsao_inicio DATE,
  valor NUMERIC,
  pix_txid TEXT,
  pix_payload TEXT,
  status TEXT DEFAULT 'aguardando_pagamento',
  origem TEXT,
  observacao_interna TEXT
);

-- ═══════════════════════════════════════════════════════════════════════════
-- 1) Novas colunas para rastreio de origem (UTMs do form)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE public.solicitacoes_art
  ADD COLUMN IF NOT EXISTS predio_codigo TEXT,
  ADD COLUMN IF NOT EXISTS embaixador_codigo TEXT,
  ADD COLUMN IF NOT EXISTS criativo TEXT;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2) Indexes para consultas rápidas no dashboard
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS ix_art_predio     ON public.solicitacoes_art(predio_codigo);
CREATE INDEX IF NOT EXISTS ix_art_embaixador ON public.solicitacoes_art(embaixador_codigo);
CREATE INDEX IF NOT EXISTS ix_art_origem     ON public.solicitacoes_art(origem);
CREATE INDEX IF NOT EXISTS ix_art_status     ON public.solicitacoes_art(status);
CREATE INDEX IF NOT EXISTS ix_art_criado_em  ON public.solicitacoes_art(criado_em DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- 3) Row Level Security + policies
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE public.solicitacoes_art ENABLE ROW LEVEL SECURITY;

-- 3.a) INSERT: qualquer visitante (anon) pode criar uma solicitação
--      (usado pelo form em /solicitar-art.html)
DROP POLICY IF EXISTS "anon_insert_art" ON public.solicitacoes_art;
CREATE POLICY "anon_insert_art"
  ON public.solicitacoes_art
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3.b) SELECT: qualquer usuário autenticado (equipe) pode ler tudo
--      (usado pelo /dashboard-marketing.html)
--      Se quiser restringir a UM subconjunto de perfis, trocar o USING (true)
--      por algo como:
--        USING (
--          EXISTS (
--            SELECT 1 FROM public.user_condos uc
--            WHERE uc.user_id = auth.uid()
--              AND uc.role IN ('equipe','admin')
--          )
--        )
DROP POLICY IF EXISTS "auth_select_art" ON public.solicitacoes_art;
CREATE POLICY "auth_select_art"
  ON public.solicitacoes_art
  FOR SELECT
  TO authenticated
  USING (true);

-- 3.c) UPDATE: só usuário autenticado (para marcar como pago/emitida do CRM)
DROP POLICY IF EXISTS "auth_update_art" ON public.solicitacoes_art;
CREATE POLICY "auth_update_art"
  ON public.solicitacoes_art
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- 4) View auxiliar para relatórios agregados (opcional, útil pra BI)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW public.vw_art_por_dia AS
SELECT
  date_trunc('day', criado_em)::date AS dia,
  COUNT(*)                            AS total,
  COUNT(*) FILTER (WHERE status <> 'aguardando_pagamento' AND status <> 'cancelada') AS pagas,
  COUNT(DISTINCT predio_codigo)       AS predios_distintos,
  COUNT(DISTINCT embaixador_codigo)   AS embaixadores_ativos,
  SUM(valor) FILTER (WHERE status <> 'cancelada') AS receita
FROM public.solicitacoes_art
GROUP BY 1
ORDER BY 1 DESC;

GRANT SELECT ON public.vw_art_por_dia TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- 5) Verificação (rode depois de aplicar o script pra confirmar)
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT column_name, data_type
--   FROM information_schema.columns
--  WHERE table_schema = 'public' AND table_name = 'solicitacoes_art'
--  ORDER BY ordinal_position;
--
-- SELECT policyname, cmd, roles
--   FROM pg_policies
--  WHERE schemaname='public' AND tablename='solicitacoes_art';
--
-- SELECT * FROM public.vw_art_por_dia LIMIT 5;
