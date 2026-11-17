-- Revisão de Pranchas — Diagnóstika (17-11-2026)
-- Tabela proj_revisoes + bucket privado "pranchas" (signed URLs).
-- Acesso: só equipe Diagnóstika (public.is_equipe_dk(), mesma regra das tabelas obra_*/campo_*).
-- Worker local (service_role) lê 'pendente', envia ao grupo Projetos e roda o arquiteto; grava saída.
-- Aplicar no SQL Editor do Supabase (como schema_obra.sql / schema_campo.sql).

create table if not exists proj_revisoes (
  id              uuid primary key default gen_random_uuid(),
  codigo_projeto  text not null,                     -- fin_projetos.codigo (ex.: ANH-545)
  projeto_id      uuid,                              -- fin_projetos.id (opcional, resolvido no app)
  autor           text,                              -- nome de quem marcou (equipe)
  user_id         uuid,
  pedido_texto    text,                              -- o que o revisor pediu, em texto
  pdf_original    text not null,                     -- caminho no bucket pranchas
  pdf_marcado     text not null,                     -- caminho no bucket pranchas (marcações embutidas)
  dwg_origem      text,                              -- caminho no bucket pranchas (opcional)
  paginas         int,
  n_marcacoes     int,
  revisao_num     int,                               -- N da "Revisão N" (worker define)
  status          text not null default 'pendente'
                  check (status in ('pendente','enviado','processando','entregue','erro')),
  enviado_grupo_em timestamptz,                      -- PDF marcado postado no grupo Projetos
  evo_message_id  text,
  processado_em   timestamptz,
  arquivos_saida  jsonb not null default '[]'::jsonb, -- [{tipo:'dwg'|'pdf', path_local, path_bucket}]
  resumo_saida    text,                              -- resumo do que o arquiteto mudou
  erro            text,
  tentativas      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists proj_revisoes_status on proj_revisoes(status, created_at);
create index if not exists proj_revisoes_codigo on proj_revisoes(codigo_projeto, created_at desc);

create or replace function public.proj_revisoes_touch() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists proj_revisoes_touch on proj_revisoes;
create trigger proj_revisoes_touch before update on proj_revisoes for each row execute function public.proj_revisoes_touch();

alter table proj_revisoes enable row level security;
drop policy if exists proj_revisoes_equipe on proj_revisoes;
create policy proj_revisoes_equipe on proj_revisoes for all to authenticated
  using (public.is_equipe_dk()) with check (public.is_equipe_dk());
grant select, insert, update on proj_revisoes to authenticated;

-- Storage: bucket PRIVADO (criado pela API; o insert abaixo é idempotente)
insert into storage.buckets (id, name, public) values ('pranchas','pranchas', false)
  on conflict (id) do update set public = false;
drop policy if exists "pranchas leitura equipe" on storage.objects;
create policy "pranchas leitura equipe" on storage.objects for select to authenticated
  using (bucket_id = 'pranchas' and public.is_equipe_dk());
drop policy if exists "pranchas escrita equipe" on storage.objects;
create policy "pranchas escrita equipe" on storage.objects for insert to authenticated
  with check (bucket_id = 'pranchas' and public.is_equipe_dk());
drop policy if exists "pranchas update equipe" on storage.objects;
create policy "pranchas update equipe" on storage.objects for update to authenticated
  using (bucket_id = 'pranchas' and public.is_equipe_dk());

select 'ok proj_revisoes + bucket pranchas' as resultado;
