-- Tabela para registrar confirmações de presença
create table if not exists public.confirmados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  adultos int not null default 0,
  criancas int not null default 0,
  whatsapp text,
  observacao text,
  created_at timestamptz not null default now()
);

create index if not exists confirmados_created_at_idx on public.confirmados (created_at);
-- Garante que o mesmo telefone não confirme o mesmo nome mais de uma vez (case/espaco insensitive)
-- Usa coalesce para tratar whatsapp vazio como string vazia (evita múltiplos NULL)
create unique index if not exists confirmados_nome_whatsapp_uidx
  on public.confirmados (lower(btrim(nome)), btrim(coalesce(whatsapp, '')));

-- Habilita RLS e libera SELECT/INSERT para role anon (frontend público)
alter table public.confirmados enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'confirmados' and policyname = 'Anon select confirmados'
  ) then
    create policy "Anon select confirmados"
      on public.confirmados
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'confirmados' and policyname = 'Anon insert confirmados'
  ) then
    create policy "Anon insert confirmados"
      on public.confirmados
      for insert
      to anon
      with check (true);
  end if;
end $$;
