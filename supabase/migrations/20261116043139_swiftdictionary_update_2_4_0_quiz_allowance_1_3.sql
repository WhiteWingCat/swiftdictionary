-- SwiftDictionary Update 2.4.0 — align live Quiz daily limits with the approved plan.
-- Narrowly updates only the Quiz rows; all other activity limits and usage
-- ledgers remain untouched.

begin;

do $precondition$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.learning_plan_limits
  where activity_type = 'quiz'
    and (
      (plan_code = 'free' and daily_limit = 5 and is_enabled = true)
      or
      (plan_code = 'premium' and daily_limit = 12 and is_enabled = true)
    );

  if v_count <> 2 then
    raise exception
      'Quiz allowance migration aborted: expected existing Free 5 and Premium 12 enabled rows; found % matching rows',
      v_count;
  end if;

  if (select count(*) from public.learning_plan_limits where activity_type='quiz') <> 2 then
    raise exception 'Quiz allowance migration aborted: unexpected extra plan rows exist';
  end if;
end;
$precondition$;

update public.learning_plan_limits
set daily_limit = case plan_code
  when 'free' then 1
  when 'premium' then 3
  else daily_limit
end,
updated_at = pg_catalog.now()
where activity_type = 'quiz'
  and plan_code in ('free','premium');

do $postcondition$
begin
  if not exists (
    select 1 from public.learning_plan_limits
    where plan_code='free' and activity_type='quiz'
      and daily_limit=1 and is_enabled=true
  ) or not exists (
    select 1 from public.learning_plan_limits
    where plan_code='premium' and activity_type='quiz'
      and daily_limit=3 and is_enabled=true
  ) then
    raise exception 'Quiz allowance migration postcondition failed';
  end if;
end;
$postcondition$;

commit;
