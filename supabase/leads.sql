create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text unique not null,
  intent text not null default 'demo' check (intent in ('demo', 'account')),
  step integer not null default 1,
  restaurant_name text not null default '',
  phone text not null default '',
  city text not null default '',
  restaurant_type text not null default '',
  tables_count text not null default '',
  current_menu_source text not null default '',
  contact_name text not null default '',
  email text not null default '',
  main_need text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

grant usage on schema public to anon;
grant insert, update, select on public.leads to anon;

drop policy if exists "Public can insert SmartEat leads" on public.leads;
create policy "Public can insert SmartEat leads"
on public.leads
for insert
to anon
with check (
  length(trim(restaurant_name)) > 0
  and lead_id = nullif(current_setting('request.headers', true)::json ->> 'x-lead-id', '')
);

drop policy if exists "Public can read matching SmartEat lead" on public.leads;
drop policy if exists "Public can only select rows for lead upsert" on public.leads;
drop policy if exists "Public cannot read SmartEat leads" on public.leads;
create policy "Public can read matching SmartEat lead"
on public.leads
for select
to anon
using (
  lead_id = nullif(current_setting('request.headers', true)::json ->> 'x-lead-id', '')
);

drop policy if exists "Public can update SmartEat leads by lead id" on public.leads;
create policy "Public can update SmartEat leads by lead id"
on public.leads
for update
to anon
using (
  lead_id = nullif(current_setting('request.headers', true)::json ->> 'x-lead-id', '')
)
with check (
  lead_id = nullif(current_setting('request.headers', true)::json ->> 'x-lead-id', '')
  and length(trim(restaurant_name)) > 0
);

create or replace function public.set_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_leads_updated_at();
