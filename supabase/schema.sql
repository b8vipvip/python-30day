-- Python Quest v2: Supabase schema, RLS and concurrency-safe progress merge.
-- Execute in Supabase SQL Editor for your own project.
-- Notes:
--   * Browser progress and local judging are self-reported, not anti-cheat proofs.
--   * Never publish a service-role/secret API key in frontend config.js.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '代码探险家'
    check (char_length(display_name) between 2 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_days integer[] not null default '{}'::integer[],
  practice jsonb not null default '{}'::jsonb,
  streak integer not null default 0 check (streak between 0 and 3650),
  last_active_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.tutor_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null default current_date,
  request_count integer not null default 0 check (request_count between 0 and 20),
  primary key (user_id, usage_day)
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.tutor_usage enable row level security;

drop policy if exists "profile owner read" on public.profiles;
create policy "profile owner read" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "profile owner create" on public.profiles;
create policy "profile owner create" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists "profile owner update" on public.profiles;
create policy "profile owner update" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "progress owner read" on public.progress;
create policy "progress owner read" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

-- Progress can only be changed through merge_my_progress. No direct DML policy.
revoke all on public.progress from anon, authenticated;
grant select on public.progress to authenticated;

revoke all on public.tutor_usage from anon, authenticated;

create or replace function public.normalize_days(input_days integer[])
returns integer[]
language sql immutable set search_path = ''
as $$
  select coalesce(array_agg(distinct x order by x), '{}'::integer[])
  from unnest(coalesce(input_days, '{}'::integer[])) as d(x)
  where x between 1 and 30
$$;

create or replace function public.clean_practice(input_practice jsonb)
returns jsonb
language sql immutable set search_path = ''
as $$
  select coalesce(jsonb_object_agg(k, true), '{}'::jsonb)
  from jsonb_each(
    case when jsonb_typeof(input_practice) = 'object'
         then input_practice else '{}'::jsonb end
  ) as v(k, val)
  where k ~ '^([1-9]|[12][0-9]|30)$' and val = 'true'::jsonb
$$;

create or replace function public.xp_for_days(input_days integer[])
returns integer
language sql immutable set search_path = ''
as $$
  select coalesce(sum(case when x in (7, 14, 21, 30) then 100 else 50 end), 0)::integer
  from unnest(public.normalize_days(input_days)) as d(x)
$$;

create or replace function public.merge_my_progress(
  new_days integer[],
  new_practice jsonb,
  new_streak integer,
  new_last_active date
)
returns public.progress
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  merged public.progress;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  insert into public.progress (
    user_id, completed_days, practice, streak, last_active_date, updated_at
  ) values (
    current_user_id,
    public.normalize_days(new_days),
    public.clean_practice(new_practice),
    least(greatest(coalesce(new_streak, 0), 0), 3650),
    new_last_active,
    now()
  )
  on conflict (user_id) do update set
    completed_days = public.normalize_days(
      public.progress.completed_days || excluded.completed_days
    ),
    practice = public.progress.practice || excluded.practice,
    streak = greatest(public.progress.streak, excluded.streak),
    last_active_date = greatest(public.progress.last_active_date, excluded.last_active_date),
    updated_at = now()
  returning * into merged;
  return merged;
end
$$;

-- Show only pseudonyms and aggregate XP; never expose email/private notes.
create or replace function public.top_learners()
returns table (
  rank bigint,
  display_name text,
  xp integer,
  completed_count integer
)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  return query
  with standings as (
    select pr.display_name,
           public.xp_for_days(p.completed_days) as score,
           cardinality(public.normalize_days(p.completed_days))::integer as lessons,
           p.updated_at
      from public.progress p
      join public.profiles pr on pr.id = p.user_id
  )
  select row_number() over (order by standings.score desc, standings.lessons desc, standings.updated_at asc) as rank,
         standings.display_name,
         standings.score,
         standings.lessons
    from standings
   order by standings.score desc, standings.lessons desc, standings.updated_at asc
   limit 50;
end
$$;

create or replace function public.consume_tutor_quota()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  used integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  insert into public.tutor_usage (user_id, usage_day, request_count)
  values (current_user_id, current_date, 1)
  on conflict (user_id, usage_day) do update
    set request_count = public.tutor_usage.request_count + 1
    where public.tutor_usage.request_count < 20
  returning request_count into used;
  return coalesce(used, 0);
end
$$;

-- New users automatically have a private profile; avoids first-login races.
create or replace function public.handle_new_quest_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, '探索者-' || left(new.id::text, 6))
  on conflict(id) do nothing;
  return new;
end
$$;

drop trigger if exists quest_auth_user_created on auth.users;
create trigger quest_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_quest_user();

revoke all on function public.normalize_days(integer[]) from public, anon, authenticated;
revoke all on function public.clean_practice(jsonb) from public, anon, authenticated;
revoke all on function public.xp_for_days(integer[]) from public, anon, authenticated;
revoke all on function public.merge_my_progress(integer[], jsonb, integer, date) from public, anon;
revoke all on function public.top_learners() from public, anon;
revoke all on function public.consume_tutor_quota() from public, anon;
grant execute on function public.merge_my_progress(integer[], jsonb, integer, date) to authenticated;
grant execute on function public.top_learners() to authenticated;
grant execute on function public.consume_tutor_quota() to authenticated;

grant select, insert, update on public.profiles to authenticated;
-- No select policy for tutor_usage: private quota data remains hidden.
