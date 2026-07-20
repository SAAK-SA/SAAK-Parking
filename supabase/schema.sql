-- ══════════════════════════════════════════════════════════════════════════
--  SAAK Parking — Supabase schema + seed
--  Run this once in your Supabase project: SQL Editor → paste → Run.
--  After running, put the project URL + anon key in your .env file.
-- ══════════════════════════════════════════════════════════════════════════

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists employees (
  id            text primary key,
  name          text not null,
  department    text,
  plate         text,
  assigned_slot text,
  building      text not null default 'factory'
);

create table if not exists parking_slots (
  number         text primary key,
  zone           text not null,
  building       text not null default 'factory',
  kind           text not null default 'employee',   -- employee | visitor | heavy
  status         text not null default 'available',  -- available | occupied | reserved | visitor | disabled
  occupant_name  text,
  occupant_plate text,
  occupant_type  text,                                -- employee | visitor
  since          text
);

create table if not exists parking_sessions (
  id        uuid primary key default gen_random_uuid(),
  kind      text not null,                            -- employee | visitor
  emp_id    text,
  name      text not null,
  company   text,
  mobile    text,
  plate     text,
  slot      text,
  building  text not null default 'factory',
  entry_at  timestamptz not null default now(),
  exit_at   timestamptz
);

create index if not exists idx_sessions_entry on parking_sessions (entry_at desc);
create index if not exists idx_sessions_open  on parking_sessions (slot) where exit_at is null;

-- ── Row Level Security ────────────────────────────────────────────────────
-- Demo policy: allow the anon key full access. Tighten this before production.

alter table employees        enable row level security;
alter table parking_slots    enable row level security;
alter table parking_sessions enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'employees' and policyname = 'anon_all') then
    create policy anon_all on employees        for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'parking_slots' and policyname = 'anon_all') then
    create policy anon_all on parking_slots    for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'parking_sessions' and policyname = 'anon_all') then
    create policy anon_all on parking_sessions for all using (true) with check (true);
  end if;
end $$;

-- ── Seed employees ────────────────────────────────────────────────────────

insert into employees (id, name, department, plate, assigned_slot, building) values
  ('EMP006', 'خالد إبراهيم المطيري', 'الإنتاج',  'ع ف ص ١١٢٢', 'D01', 'factory'),
  ('EMP007', 'سارة عمر الدوسري',     'الجودة',   'ق ر ش ٣٣٤٤', 'D02', 'factory'),
  ('EMP008', 'عمر حسن البلوي',       'الصيانة',  'ت ث خ ٥٥٦٦', 'D03', 'factory'),
  ('EMP009', 'ريم ناصر العتيبي',     'السلامة',  'ذ ض ظ ٧٧٨٨', 'D04', 'factory')
on conflict (id) do nothing;

-- ── Seed slots (Zone D: 18 employee, Zone E: 8 visitor, Zone F: 4 heavy) ──

insert into parking_slots (number, zone, building, kind, status)
select 'D' || lpad(g::text, 2, '0'), 'D', 'factory', 'employee', 'available' from generate_series(1, 18) g
on conflict (number) do nothing;

insert into parking_slots (number, zone, building, kind, status)
select 'E' || lpad(g::text, 2, '0'), 'E', 'factory', 'visitor', 'available' from generate_series(1, 8) g
on conflict (number) do nothing;

insert into parking_slots (number, zone, building, kind, status)
select 'F' || lpad(g::text, 2, '0'), 'F', 'factory', 'heavy', 'available' from generate_series(1, 4) g
on conflict (number) do nothing;

-- Seeded occupants (optional demo data)
update parking_slots set status='occupied', occupant_name='خالد إبراهيم المطيري', occupant_plate='ع ف ص ١١٢٢', occupant_type='employee', since='06:50' where number='D01';
update parking_slots set status='occupied', occupant_name='سارة عمر الدوسري',     occupant_plate='ق ر ش ٣٣٤٤', occupant_type='employee', since='07:00' where number='D02';
update parking_slots set status='occupied', occupant_name='عمر حسن البلوي',       occupant_plate='ت ث خ ٥٥٦٦', occupant_type='employee', since='07:15' where number='D03';
update parking_slots set status='occupied', occupant_name='ريم ناصر العتيبي',     occupant_plate='ذ ض ظ ٧٧٨٨', occupant_type='employee', since='07:30' where number='D04';
update parking_slots set status='visitor',  occupant_name='ناصر القرني',          occupant_plate='هـ و ٦٦٧٧', occupant_type='visitor',  since='08:30' where number='E01';
update parking_slots set status='disabled' where number in ('F03', 'F04');
