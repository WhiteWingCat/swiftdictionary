-- U2.8.0 Chinese Quiz routing and bank-readiness regression.
-- Runs only after the additive U2.8.0 Chinese Quiz migration is installed.
begin;

select set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true);
select set_config('request.jwt.claims','{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccccccc"}',true);

update public.user_preferences
set learning_language='zh',translation_language='en'
where user_id=auth.uid();

do $chinese_quiz_routing$
declare
  v_availability jsonb;
  v_beginner jsonb;
  v_reason text;
  v_session jsonb;
  v_failed boolean:=false;
begin
  v_availability:=public.get_my_quiz_availability();
  if v_availability->>'learning_language_code'<>'zh' then
    raise exception 'Chinese Quiz availability did not retain the selected learning course';
  end if;

  select value into v_beginner
  from jsonb_array_elements(v_availability->'difficulties')
  where value->>'difficulty'='beginner';
  if v_beginner is null then
    raise exception 'Chinese Quiz availability omitted Beginner difficulty';
  end if;

  v_reason:=v_beginner->>'reason';
  if v_reason='learning_course_not_supported' then
    raise exception 'U2.8.0 Chinese Quiz was incorrectly routed to the legacy English-only availability function';
  end if;

  if coalesce((v_beginner->>'available')::boolean,false) then
    v_session:=public.start_my_quiz('beginner');
    if v_session->>'status'<>'in_progress'
       or v_session->>'learning_language_code'<>'zh'
       or jsonb_array_length(v_session->'questions')<>10 then
      raise exception 'Chinese Beginner Quiz session has an invalid language or question count';
    end if;
    if exists (
      select 1 from jsonb_array_elements(v_session->'questions') q
      where q->>'learning_language_code'<>'zh'
         or q->>'answer_language_code'<>'zh'
    ) then
      raise exception 'Chinese Quiz question snapshots contain an incorrect language';
    end if;
    perform public.abandon_my_quiz((v_session->>'session_id')::uuid);
  else
    if v_reason not in ('question_bank_below_minimum','fresh_questions_unavailable_today','allowance_exhausted','active_session_exists','plan_not_enabled') then
      raise exception 'Chinese Quiz returned an unexpected availability reason: %',v_reason;
    end if;
    begin
      perform public.start_my_quiz('beginner');
    exception when sqlstate 'P0001' or insufficient_privilege then
      v_failed:=true;
    end;
    if not v_failed and v_reason in ('question_bank_below_minimum','fresh_questions_unavailable_today','allowance_exhausted','plan_not_enabled') then
      raise exception 'Chinese Quiz started despite its availability restriction: %',v_reason;
    end if;
  end if;
end;
$chinese_quiz_routing$;

rollback;
