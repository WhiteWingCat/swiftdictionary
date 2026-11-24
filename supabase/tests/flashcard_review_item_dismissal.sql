-- Authenticated, account-scoped weak-memory dismissal regression.
-- Run in a disposable Supabase-compatible database; all fixtures roll back.

begin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values
  ('a2800000-0000-4000-8000-000000000001','authenticated','authenticated','flashcard-dismiss-a@example.invalid',now(),now(),now()),
  ('a2800000-0000-4000-8000-000000000002','authenticated','authenticated','flashcard-dismiss-b@example.invalid',now(),now(),now());

insert into private.flashcard_sessions(
  id,user_id,mode,difficulty,status,words_seen,correct_count,incorrect_count,unanswered_count,
  started_at,completed_at,duration_seconds,learning_language_code,translation_language_code
) values (
  'a2800000-0000-4000-8000-000000000003',
  'a2800000-0000-4000-8000-000000000001',
  'translation','beginner','completed',1,0,1,0,now()-interval '1 minute',now(),60,'zh','en'
);

insert into private.flashcard_mastery(user_id,card_key,correct_count,incorrect_count,current_streak,last_result,last_seen_at)
values('a2800000-0000-4000-8000-000000000001','dict:zh:你',3,2,0,'incorrect',now());

insert into private.flashcard_review_items(user_id,card_key,mode,incorrect_count,last_incorrect_at,last_session_id)
values
  ('a2800000-0000-4000-8000-000000000001','dict:zh:你','translation',2,now(),'a2800000-0000-4000-8000-000000000003'),
  ('a2800000-0000-4000-8000-000000000001','dict:zh:你','word',1,now(),'a2800000-0000-4000-8000-000000000003'),
  ('a2800000-0000-4000-8000-000000000002','dict:zh:你','translation',4,now(),null);

do $privileges$
begin
  if not has_function_privilege('authenticated','public.dismiss_my_flashcard_review_item(text,text)','EXECUTE') then
    raise exception 'Authenticated role cannot execute the public dismissal RPC';
  end if;
  if has_function_privilege('anon','public.dismiss_my_flashcard_review_item(text,text)','EXECUTE') then
    raise exception 'Anonymous role must not execute the public dismissal RPC';
  end if;
  if has_function_privilege('anon','private.dismiss_my_flashcard_review_item_impl(text,text)','EXECUTE') then
    raise exception 'Anonymous role must not execute the private implementation';
  end if;
end
$privileges$;

set local role authenticated;
select set_config('request.jwt.claim.sub','a2800000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"a2800000-0000-4000-8000-000000000001","role":"authenticated"}',true);

do $test$
declare
  v_result jsonb;
  v_second jsonb;
begin
  if auth.uid() <> 'a2800000-0000-4000-8000-000000000001'::uuid then
    raise exception 'JWT subject was not recognised by auth.uid()';
  end if;
  v_result := public.dismiss_my_flashcard_review_item('dict:zh:你','translation');
  if v_result->>'dismissed' <> 'true' or (v_result->>'removed_count')::integer <> 1 then
    raise exception 'Dismissal did not remove exactly one selected review item: %',v_result;
  end if;
  v_second := public.dismiss_my_flashcard_review_item('dict:zh:你','translation');
  if v_second->>'dismissed' <> 'false' or (v_second->>'removed_count')::integer <> 0 then
    raise exception 'Repeated dismissal should be an idempotent no-op: %',v_second;
  end if;
end
$test$;

reset role;

do $assert$
begin
  if exists(select 1 from private.flashcard_review_items where user_id='a2800000-0000-4000-8000-000000000001' and card_key='dict:zh:你' and mode='translation') then
    raise exception 'Dismissed review item still exists for its owner';
  end if;
  if not exists(select 1 from private.flashcard_review_items where user_id='a2800000-0000-4000-8000-000000000001' and card_key='dict:zh:你' and mode='word') then
    raise exception 'Dismissing Translation Recall also removed another mode';
  end if;
  if not exists(select 1 from private.flashcard_review_items where user_id='a2800000-0000-4000-8000-000000000002' and card_key='dict:zh:你' and mode='translation') then
    raise exception 'Dismissing one user item affected another account';
  end if;
  if not exists(select 1 from private.flashcard_mastery where user_id='a2800000-0000-4000-8000-000000000001' and card_key='dict:zh:你' and incorrect_count=2) then
    raise exception 'Dismissal must preserve learning mastery statistics';
  end if;
  if not exists(select 1 from private.flashcard_sessions where id='a2800000-0000-4000-8000-000000000003' and status='completed') then
    raise exception 'Dismissal must preserve the completed game history';
  end if;
end
$assert$;

rollback;
