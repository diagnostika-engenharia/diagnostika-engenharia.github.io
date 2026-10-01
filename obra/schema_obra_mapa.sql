-- Marcações de avanço físico do croqui (planta/fachadas) e do modelo 3D — Diagnóstika
-- Uma linha por quadro marcado; obra_mapa_hist guarda quem mudou o quê e quando (rastreabilidade da medição).

create table if not exists obra_mapa (
  obra_id     text not null references obra_obras(id),
  chave       text not null,            -- '3d:<faixa>-<pav>' ou 'croqui:<fachada>:<quadro>'
  etapa       int  not null check (etapa between 0 and 5),
  user_id     uuid,
  user_nome   text,
  updated_at  timestamptz not null default now(),
  primary key (obra_id, chave)
);

create table if not exists obra_mapa_hist (
  id          bigserial primary key,
  obra_id     text not null,
  chave       text not null,
  etapa_de    int,
  etapa_para  int not null,
  user_id     uuid,
  user_nome   text,
  em          timestamptz not null default now()
);
create index if not exists obra_mapa_hist_obra_em on obra_mapa_hist(obra_id, em desc);

alter table obra_mapa      enable row level security;
alter table obra_mapa_hist enable row level security;
drop policy if exists obra_mapa_auth on obra_mapa;
create policy obra_mapa_auth on obra_mapa for all to authenticated using (true) with check (true);
drop policy if exists obra_mapa_hist_ler on obra_mapa_hist;
create policy obra_mapa_hist_ler on obra_mapa_hist for select to authenticated using (true);

drop trigger if exists obra_mapa_touch on obra_mapa;
create trigger obra_mapa_touch before update on obra_mapa
  for each row execute function obra_touch_updated_at();

create or replace function obra_mapa_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.etapa = new.etapa then return new; end if;
  insert into obra_mapa_hist (obra_id, chave, etapa_de, etapa_para, user_id, user_nome)
  values (new.obra_id, new.chave, case when tg_op = 'UPDATE' then old.etapa end, new.etapa, new.user_id, new.user_nome);
  return new;
end $$;
drop trigger if exists obra_mapa_log on obra_mapa;
create trigger obra_mapa_log after insert or update on obra_mapa
  for each row execute function obra_mapa_log();

select 'obra_mapa ok' as resultado;
