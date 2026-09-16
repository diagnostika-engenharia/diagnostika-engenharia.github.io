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
  transcricao   text,
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
