-- Vistoria de Campo (visita técnica avulsa: cliente, endereço, demanda) — Diagnóstika
-- Tabelas: campo_visitas, campo_itens · arquivos no bucket obra-fotos, prefixo campo/
-- Acesso: só equipe Diagnóstika (public.is_equipe_dk(), mesma regra das tabelas obra_*).
-- Processamento (n8n): lê visitas com status 'processando', grava resultado (jsonb) e muda para 'processada'.

create table if not exists campo_visitas (
  id            uuid primary key default gen_random_uuid(),
  data          date not null default (now() at time zone 'America/Sao_Paulo')::date,
  cliente       text not null,
  contato       text,
  endereco      text,
  condominio    text,
  tipo_demanda  text,
  descricao     text,                 -- relato inicial do cliente
  engenheiro    text,
  user_id       uuid,
  status        text not null default 'em_campo'
                check (status in ('em_campo','processando','processada','erro','arquivada')),
  resultado     jsonb,                -- {levantamento, problemas[], pendencias[], escopo_sugerido}
  processado_em timestamptz,
  erro_processamento text,
  proposta      jsonb,                -- rascunho de honorários editado pelo engenheiro
  device_id     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists campo_visitas_data on campo_visitas(data desc);
create index if not exists campo_visitas_status on campo_visitas(status);

create table if not exists campo_itens (
  id            uuid primary key default gen_random_uuid(),
  visita_id     uuid not null references campo_visitas(id) on delete cascade,
  tipo          text not null check (tipo in ('foto','audio','nota')),
  texto         text,
  fotos         text[] not null default '{}',
  audio_path    text,
  transcricao   text,
  transcrito_em timestamptz,
  erro_transcricao text,
  local         text,                 -- cômodo/ambiente (opcional)
  autor         text,
  device_id     text,
  created_at    timestamptz not null default now()
);
create index if not exists campo_itens_visita on campo_itens(visita_id, created_at);

create or replace function public.campo_touch() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists campo_visitas_touch on campo_visitas;
create trigger campo_visitas_touch before update on campo_visitas for each row execute function public.campo_touch();

alter table campo_visitas enable row level security;
alter table campo_itens   enable row level security;
drop policy if exists campo_visitas_equipe on campo_visitas;
drop policy if exists campo_itens_equipe   on campo_itens;
create policy campo_visitas_equipe on campo_visitas for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());
create policy campo_itens_equipe   on campo_itens   for all to authenticated using (public.is_equipe_dk()) with check (public.is_equipe_dk());

select 'ok campo_*' as resultado;
