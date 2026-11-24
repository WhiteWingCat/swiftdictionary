-- U2.8.0 authenticated Chinese Flashcards mode and language-routing regression.
-- Runs after the additive language/snapshot migration; all fixtures roll back.
begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values(
  'a2500000-0000-4000-8000-000000000002',
  'authenticated','authenticated','flashcards-chinese-ci@example.invalid',now(),now(),now()
);

insert into public.user_preferences(user_id,learning_language,translation_language,timezone)
values('a2500000-0000-4000-8000-000000000002','zh','en','Asia/Kuala_Lumpur');

insert into public.user_entitlements(user_id,plan_code,status)
values('a2500000-0000-4000-8000-000000000002','free','active');

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"a2500000-0000-4000-8000-000000000002","role":"authenticated"}',true);

do $test$
declare
  v_sentence jsonb;
  v_translation jsonb;
  v_data jsonb;
  v_mixed_blocked boolean:=false;
begin
  v_sentence:=public.start_my_flashcard_game('sentence','beginner',60);
  if v_sentence->>'session_id' is null
     or v_sentence->>'learning_language_code'<>'zh'
     or v_sentence->>'translation_language_code'<>'en' then
    raise exception 'Chinese Sentence Recall did not retain the selected language pair: %',v_sentence;
  end if;
  perform public.abandon_my_flashcard_game((v_sentence->>'session_id')::uuid);

  v_translation:=public.start_my_flashcard_game('translation','beginner',60);
  if v_translation->>'session_id' is null
     or v_translation->>'learning_language_code'<>'zh'
     or v_translation->>'translation_language_code'<>'en' then
    raise exception 'Chinese Translation Recall did not retain the selected language pair: %',v_translation;
  end if;
  perform public.abandon_my_flashcard_game((v_translation->>'session_id')::uuid);

  begin
    perform public.start_my_flashcard_game('mixed','beginner',60);
  exception when sqlstate '22023' then
    v_mixed_blocked:=true;
  end;
  if not v_mixed_blocked then
    raise exception 'Chinese Mixed Recall must remain unavailable; Translation Recall is the supported equivalent';
  end if;

  v_data:=public.get_my_flashcard_data();
  if (v_data->'allowance'->>'used_count')::integer<>0 then
    raise exception 'Abandoned Chinese Flashcard games must not consume allowance: %',v_data->'allowance';
  end if;
end
$test$;

rollback;
