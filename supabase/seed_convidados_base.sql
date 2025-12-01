-- Cria tabela para armazenar a lista pré-cadastrada de convidados por telefone
create table if not exists public.convidados_base (
  id uuid primary key default gen_random_uuid(),
  telefone text not null,
  nomes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists convidados_base_telefone_idx on public.convidados_base (telefone);

-- Habilita RLS e libera leitura/inserção pelo role anon (frontend público)
alter table public.convidados_base enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'convidados_base' and policyname = 'Anon select convidados_base'
  ) then
    create policy "Anon select convidados_base"
      on public.convidados_base
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'convidados_base' and policyname = 'Anon insert convidados_base'
  ) then
    create policy "Anon insert convidados_base"
      on public.convidados_base
      for insert
      to anon
      with check (true);
  end if;
end $$;

-- Popula a lista de convidados base
insert into public.convidados_base (telefone, nomes) values
  ('(33-98751-4845)', ARRAY['Edlamar','Edson']),
  ('(33-99959-3177)', ARRAY['Tatiana','Marido','Talita','Dani','Robson']),
  ('(94-99177-5601)', ARRAY['Robinho','Guilherme','Lara']),
  ('(33-99989-8109)', ARRAY['Julio','Alessandra','Ronaldo','Julia']),
  ('(33-98418-6823)', ARRAY['Andreia','Jose','Luis','Alexandre','Luiz','Henrique']),
  ('(33-99103-2147)', ARRAY['lsabela','Nilton']),
  ('(33-99128-7142)', ARRAY['Somara','Ricordo','Ana','koroline','Maria','julia']),
  ('(73-99167-1399)', ARRAY['Lena','Klecio','Gabriela','Rafael']),
  ('(33-99981-2656)', ARRAY['Luzimar','Valter','Matheus']),
  ('(21-97999-5100)', ARRAY['Janaina','Eduardo','Liz']),
  ('(91-98174-9200)', ARRAY['Fernando','Camila']),
  ('(21-99893-5477)', ARRAY['Gustavo']),
  ('(33-99193-5787)', ARRAY['Bruno','carol','filho 1','filho 2','filho 3']),
  ('(27-98141-4959)', ARRAY['Renata','Thiago','Alicia']),
  ('(33-98405-6349)', ARRAY['Otho','Rosangela','Tai','Vilma']),
  ('(33--99998-2028)', ARRAY['Thais','Matozinho','Marcia','Alair','Júnior']),
  ('(33--93505-1620)', ARRAY['Sergio','Marilda','Matheus','Maria','luiza']),
  ('(33-98756-1874)', ARRAY['Lúcio','Bruna','Caio']),
  ('(33-98834-3614)', ARRAY['Adriano','Gina','Santiago','Laura']),
  ('(33-99136-9389)', ARRAY['Maxwell','Livia','Laura','Helena']),
  ('(48-99118-0028)', ARRAY['Libny','Marido','Lívia','Letícia']),
  ('(33-99907-4655)', ARRAY['Vó','Bia','Ilda']),
  ('(33-99929-3721)', ARRAY['Tio Agnaldo','Esposa','Filho 1','Filho 2','Filho 3']),
  ('(33-99979-7345)', ARRAY['Tia Aparecida','filho 1']),
  ('(33-98407-5597)', ARRAY['Julia','Fernando']),
  ('(3399140-7435)', ARRAY['Najara','Joba','Laura']),
  ('(33-99965-6970)', ARRAY['Itamara','Marcelo','Eva']),
  ('(3399873-8728)', ARRAY['Deliane']),
  ('(33-988076807)', ARRAY['Hebert','Gustavo','Filho']),
  ('(33-99163-6363)', ARRAY['Raifa']),
  ('(33-99909)', ARRAY['Amanda','Elena']),
  ('(33-99979-0069)', ARRAY['Val Porto']),
  ('(33-99918-1871)', ARRAY['Rodrigo']),
  ('(33-99922-0239)', ARRAY['Zanetti','Dayse']),
  ('(33-99191-5282)', ARRAY['Ana Clara','Vinicius','Davi','Lara']),
  ('(33-99150-9206)', ARRAY['Sandro','Nayane','Ana','Elise','Joao','Henrique']),
  ('(33-98421-2881)', ARRAY['Wallace']),
  ('(37-99924-0227)', ARRAY['Dani']),
  ('(33-99812-0605)', ARRAY['Brandon','Natalia','Joao','Vitor','Pedro']),
  ('(33-98432-5547)', ARRAY['Heitor','Emília']),
  ('(33-99824-2335)', ARRAY['Natalia','Renato','Julia']),
  ('(33-99971-4524)', ARRAY['Vania','Bruno','Theo']),
  ('(33-99906-3755)', ARRAY['Isabella','Doula']),
  ('(33-99112-9783)', ARRAY['Laiz','Alvaro','Augusto']),
  ('(31-98385-6350)', ARRAY['Marcelinho']),
  ('(33-99978-2204)', ARRAY['Camila','Esposo','Caetano','Frencisco']),
  ('(33-99131-3866)', ARRAY['Kissila','Saul']),
  ('(33-99133-3644)', ARRAY['Bruna','Gabriel']),
  ('(33-99988-2505)', ARRAY['Thais','Creusa']),
  ('(33-99114-9914)', ARRAY['Dina','Gustavo']),
  ('(33-98873-5858)', ARRAY['Lili']),
  ('(33-99902-1434)', ARRAY['Aline','Diguin','Conceição','Lara','Luna']),
  ('(33-99849-1198)', ARRAY['Dila']),
  ('(33-98419-3581)', ARRAY['Ketsia','Esposo','filho 1','filho 2']),
  ('(31-99406-3003)', ARRAY['Patricia','Esposo']),
  ('(33-99708-5482)', ARRAY['Vinicius','Dani','Antonela','Jose','Neto']),
  ('(33-99985-5486)', ARRAY['Grazielle','Temponi','Leonardo','Luca','Miguel']),
  ('(33-99818-0301)', ARRAY['Grazy Bitencourt','Maria Clara','Arthur']),
  ('(3398448-3088)', ARRAY['Ketila','Lalo']),
  ('(33-99954-2972)', ARRAY['Andrea','Elcio']);
