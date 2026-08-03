-- ══════════════════════════════════════════════════════════════════════════
--  SAAK Parking — Visitor registration schema
--  Run this once in your Supabase project: SQL Editor → paste → Run.
--  After running, put the project URL + anon key in your .env file
--  (and in your host's environment variables, e.g. Netlify).
-- ══════════════════════════════════════════════════════════════════════════

create table if not exists visits (
  id              uuid primary key default gen_random_uuid(),
  visit_number    text not null unique,
  name            text not null,
  phone           text not null,
  plate           text not null,
  visit_date      date not null,
  created_at      timestamptz not null default now(),
  checked_out_at  timestamptz
);

create index if not exists idx_visits_created     on visits (created_at desc);
create index if not exists idx_visits_number       on visits (visit_number);
create index if not exists idx_visits_active       on visits (visit_number) where checked_out_at is null;

-- ── Row Level Security ────────────────────────────────────────────────────
-- Demo policy: allow the anon key full access. Tighten this before production
-- (e.g. restrict UPDATE/DELETE to an authenticated admin role).

alter table visits enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visits' and policyname = 'anon_all') then
    create policy anon_all on visits for all using (true) with check (true);
  end if;
end $$;
