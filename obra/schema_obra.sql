-- Módulo Vistoria de Campo (Obra) — Diagnóstika
-- Tabelas: obra_obras, obra_visitas, obra_registros · bucket: obra-fotos
-- Acesso: qualquer usuário autenticado da equipe (não-síndico) lê/escreve.

create extension if not exists pgcrypto;

create table if not exists obra_obras (
  id          text primary key,
  nome        text not null,
  cliente     text,
  contrato    text,
  executora   text,
  fachadas    jsonb not null default '[]'::jsonb,
  ativa       boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into obra_obras (id, nome, cliente, contrato, executora, fachadas) values
 ('menotti', 'Restauração de Fachadas — Ed. Menotti del Picchia',
  'Condomínio Edifício Menotti del Picchia', 'DK-2025-029', 'AAM Engenharia',
  '["Fachada 1 — Frontal","Fachada 2 — Lateral Esquerda","Fachada 3 — Posterior","Fachada 4 — Lateral Direita","Cobertura / Barrilete","Térreo / Canteiro"]'::jsonb)
on conflict (id) do nothing;

create table if not exists obra_visitas (
  id            uuid primary key default gen_random_uuid(),
  obra_id       text not null references obra_obras(id),
  data          date not null default current_date,
  hora_inicio   time,
  hora_fim      time,
  engenheiro    text,
  user_id       uuid,
  clima         text,
  temperatura   text,
  paralisacao   boolean not null default false,
  efetivo       jsonb not null default '{}'::jsonb,
  encarregado   text,
  lider         text,
  resumo        text,
  status        text not null default 'em_andamento' check (status in ('em_andamento','concluida')),
  device_id     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists obra_visitas_obra_data on obra_visitas(obra_id, data desc);

create table if not exists obra_registros (
  id            uuid primary key default gen_random_uuid(),
  visita_id     uuid not null references obra_visitas(id) on delete cascade,
  obra_id       text not null references obra_obras(id),
  tipo          text not null check (tipo in ('checklist','servico','nc','ocorrencia','material','observacao','foto')),
  fachada       text,
  pavimento     text,
  item          text,
  status        text check (status in ('ok','nc','na','nao_iniciado','andamento','concluido')),
  percentual    int check (percentual between 0 and 100),
  descricao     text,
  fotos         text[] not null default '{}',
  audio_path    text,
  transcricao   text,          -- transcrição Whisper do áudio (Edge Function obra-transcrever)
  transcrito_em timestamptz,
  erro_transcricao text,
  nc_resolvida  boolean not null default false,
  nc_resolvida_em timestamptz,
  user_id       uuid,
  created_at    timestamptz not null default now()
);
create index if not exists obra_registros_visita on obra_registros(visita_id);
create index if not exists obra_registros_obra_tipo on obra_registros(obra_id, tipo, created_at desc);

-- RLS: equipe autenticada
alter table obra_obras     enable row level security;
alter table obra_visitas   enable row level security;
alter table obra_registros enable row level security;

drop policy if exists obra_obras_auth on obra_obras;
create policy obra_obras_auth on obra_obras for all to authenticated using (true) with check (true);
drop policy if exists obra_visitas_auth on obra_visitas;
create policy obra_visitas_auth on obra_visitas for all to authenticated using (true) with check (true);
drop policy if exists obra_registros_auth on obra_registros;
create policy obra_registros_auth on obra_registros for all to authenticated using (true) with check (true);

-- updated_at automático
create or replace function obra_touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists obra_visitas_touch on obra_visitas;
create trigger obra_visitas_touch before update on obra_visitas
  for each row execute function obra_touch_updated_at();

-- Storage: bucket público de leitura, escrita só autenticado
insert into storage.buckets (id, name, public) values ('obra-fotos','obra-fotos', true)
on conflict (id) do nothing;

drop policy if exists "obra-fotos leitura" on storage.objects;
create policy "obra-fotos leitura" on storage.objects for select using (bucket_id = 'obra-fotos');
drop policy if exists "obra-fotos escrita" on storage.objects;
create policy "obra-fotos escrita" on storage.objects for insert to authenticated with check (bucket_id = 'obra-fotos');
drop policy if exists "obra-fotos update" on storage.objects;
create policy "obra-fotos update" on storage.objects for update to authenticated using (bucket_id = 'obra-fotos');
drop policy if exists "obra-fotos delete" on storage.objects;
create policy "obra-fotos delete" on storage.objects for delete to authenticated using (bucket_id = 'obra-fotos');

-- ── Equipe da obra (cadastro de funcionários da executora) · 19/10/2026 ──
create table if not exists obra_funcionarios (
  id          uuid primary key default gen_random_uuid(),
  obra_id     text not null references obra_obras(id),
  nome        text not null,
  funcao      text not null,
  empresa     text,
  matricula   text,            -- nº da ficha de registro / matrícula
  telefone    text,            -- contato (WhatsApp)
  observacao  text,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists obra_funcionarios_obra on obra_funcionarios(obra_id, ativo, funcao, nome);
alter table obra_funcionarios enable row level security;
drop policy if exists obra_funcionarios_auth on obra_funcionarios;
create policy obra_funcionarios_auth on obra_funcionarios for all to authenticated using (true) with check (true);
drop trigger if exists obra_funcionarios_touch on obra_funcionarios;
create trigger obra_funcionarios_touch before update on obra_funcionarios
  for each row execute function obra_touch_updated_at();
-- presença nominal por vistoria: [{id,nome,funcao}] (snapshot, não quebra se o cadastro mudar)
alter table obra_visitas add column if not exists presentes jsonb not null default '[]'::jsonb;

-- 20/10/2026: colunas adicionadas depois da criação
alter table obra_funcionarios add column if not exists telefone text;
alter table obra_visitas add column if not exists lider text;

-- ============================================================================
-- 20-10-2026 — RLS por equipe (item 3 da CHECAGEM_GERAL_20-10-2026, §3)
-- Antes: toda policy obra_* era "authenticated using(true)", ou seja, um síndico
-- logado no Portal (user_condos.role='sindico') também podia ler/escrever as
-- vistorias. Agora só a equipe Diagnóstika (usuário autenticado SEM linha de
-- síndico em user_condos) acessa obra_*; o service_role (n8n/robôs) ganha GRANT.
-- A RPC pública obra_mapa_publico (security definer) continua servindo o link
-- do mapa a quem não faz login — não mexer nela.
-- Rodar inteiro no SQL Editor do Supabase (projeto fimmjgdwhifsrrbreche).
-- EXECUTADO no banco em 20/10/2026 ~17:05 BRT (SQL Editor, sessão do Rogério); conferido: 7 policies *_equipe + storage, app OK.
-- ============================================================================

create or replace function public.is_equipe_dk()
returns boolean
language plpgsql stable security definer
set search_path = public, pg_catalog
set row_security = off
as $$
begin
  if auth.uid() is null then return false; end if;
  return not exists (
    select 1 from public.user_condos uc
    where uc.user_id = auth.uid() and uc.role = 'sindico'
  );
end $$;
revoke all on function public.is_equipe_dk() from public;
grant execute on function public.is_equipe_dk() to authenticated, service_role;

-- tabelas do app (RLS já ligado em todas)
drop policy if exists obra_obras_auth        on obra_obras;
drop policy if exists obra_visitas_auth      on obra_visitas;
drop policy if exists obra_registros_auth    on obra_registros;
drop policy if exists obra_funcionarios_auth on obra_funcionarios;
drop policy if exists obra_mapa_auth         on obra_mapa;
drop policy if exists obra_mapa_hist_ler     on obra_mapa_hist;
drop policy if exists obra_mapa_links_auth   on obra_mapa_links;

create policy obra_obras_equipe        on obra_obras        for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy obra_visitas_equipe      on obra_visitas      for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy obra_registros_equipe    on obra_registros    for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy obra_funcionarios_equipe on obra_funcionarios for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy obra_mapa_equipe         on obra_mapa         for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy obra_mapa_hist_equipe    on obra_mapa_hist    for select to authenticated using (public.is_equipe_dk());
create policy obra_mapa_links_equipe   on obra_mapa_links   for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());

-- storage: leitura pública do bucket fica como está (fotos nos relatórios/links);
-- escrita só pela equipe
drop policy if exists "obra-fotos escrita" on storage.objects;
drop policy if exists "obra-fotos update"  on storage.objects;
drop policy if exists "obra-fotos delete"  on storage.objects;
create policy "obra-fotos escrita" on storage.objects for insert to authenticated with check (bucket_id = 'obra-fotos' and public.is_equipe_dk());
create policy "obra-fotos update"  on storage.objects for update to authenticated using (bucket_id = 'obra-fotos' and public.is_equipe_dk());
create policy "obra-fotos delete"  on storage.objects for delete to authenticated using (bucket_id = 'obra-fotos' and public.is_equipe_dk());

-- backend (n8n / robôs com service_role): hoje dá 42501 "permission denied for table obra_visitas"
grant usage on schema public to service_role;
grant all on table obra_obras, obra_visitas, obra_registros, obra_funcionarios, obra_mapa, obra_mapa_hist, obra_mapa_links to service_role;
grant usage, select on all sequences in schema public to service_role;

-- conferência rápida depois de rodar (logado como equipe deve dar true; como síndico, false):
-- select public.is_equipe_dk();
-- select policyname, tablename from pg_policies where tablename like 'obra_%' order by 2,1;
