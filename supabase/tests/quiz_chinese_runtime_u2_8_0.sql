-- U2.8.0 Chinese Quiz routing and bank-readiness regression.
-- Runs only after the additive U2.8.0 Chinese Quiz migration is installed.
\set ON_ERROR_STOP on
begin;

insert into auth.users(id)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
on conflict (id) do nothing;

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','zh','en','Asia/Kuala_Lumpur')
on conflict (user_id) do update set
  learning_language=excluded.learning_language,
  translation_language=excluded.translation_language,
  timezone=excluded.timezone;

insert into public.user_entitlements(user_id,plan_code,status)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','free','active')
on conflict (user_id) do update set
  plan_code='free',status='active',valid_from=null,valid_until=null;

update public.learning_plan_limits
set daily_limit=1,is_enabled=true
where plan_code='free' and activity_type='quiz';

select set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true);
select set_config('request.jwt.claims','{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccccccc"}',true);

do $chinese_quiz_routing$
declare
  v_availability jsonb;
  v_beginner jsonb;
  v_reason text;
begin
  v_availability:=public.get_my_quiz_availability();
  if v_availability->>'learning_language_code'<>'zh' then
    raise exception 'Chinese Quiz availability did not retain the selected learning course: %',v_availability;
  end if;

  select value into v_beginner
  from jsonb_array_elements(v_availability->'difficulties')
  where value->>'difficulty'='beginner';
  if v_beginner is null then
    raise exception 'Chinese Quiz availability omitted Beginner difficulty';
  end if;

  v_reason:=v_beginner->>'reason';
  if v_reason is distinct from 'learning_course_not_supported' then
    raise exception 'Unapproved Chinese Quiz draft content must remain unavailable; got % (payload %)',v_reason,v_availability;
  end if;
  begin
    perform public.start_my_quiz('beginner');
    raise exception 'Chinese Quiz start bypassed the approved-content release gate';
  exception when insufficient_privilege then
    null;
  end;
end;
$chinese_quiz_routing$;

rollback;
