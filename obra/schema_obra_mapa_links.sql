-- Links de visualização (só leitura) do croqui e do modelo 3D — Diagnóstika
-- Cada link tem um token aleatório, um rótulo (Conselho, Síndica, AAM...) e pode ser desativado a qualquer momento.
-- Quem abre o link não faz login: lê as marcações pela função obra_mapa_publico, que só devolve dados se o token estiver ativo.
-- Ninguém de fora consegue gravar: obra_mapa continua liberada só para usuários autenticados.

create table if not exists obra_mapa_links (
  token      text primary key default encode(gen_random_bytes(18), 'hex'),
  obra_id    text not null references obra_obras(id),
  rotulo     text not null,
  ativo      boolean not null default true,
  criado_por text,
  criado_em  timestamptz not null default now(),
  ultimo_acesso timestamptz
);

alter table obra_mapa_links enable row level security;
drop policy if exists obra_mapa_links_auth on obra_mapa_links;
create policy obra_mapa_links_auth on obra_mapa_links for all to authenticated using (true) with check (true);

create or replace function obra_mapa_publico(p_token text)
returns table (chave text, etapa int, updated_at timestamptz, rotulo text)
language plpgsql security definer set search_path = public as $$
declare v_obra text; v_rot text;
begin
  select l.obra_id, l.rotulo into v_obra, v_rot from obra_mapa_links l where l.token = p_token and l.ativo;
  if v_obra is null then raise exception 'link inválido ou desativado'; end if;
  update obra_mapa_links set ultimo_acesso = now() where token = p_token;
  return query select m.chave, m.etapa, m.updated_at, v_rot from obra_mapa m where m.obra_id = v_obra;
end $$;

revoke all on function obra_mapa_publico(text) from public;
grant execute on function obra_mapa_publico(text) to anon, authenticated;

select 'obra_mapa_links ok' as resultado;
