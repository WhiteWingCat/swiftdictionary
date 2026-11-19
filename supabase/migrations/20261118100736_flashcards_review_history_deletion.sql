-- Keep mode-specific Flashcards review history covered by account history deletion.
begin;
create or replace function private.delete_my_learning_history_impl()
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_jwt jsonb;
  v_session_id uuid;
  v_session_created_at timestamptz;
  v_session_not_after timestamptz;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  v_jwt := auth.jwt();
  v_session_id := nullif(v_jwt ->> 'session_id','')::uuid;

  select s.created_at,s.not_after
    into v_session_created_at,v_session_not_after
    from auth.sessions s
    where s.id=v_session_id and s.user_id=v_user;

  if not found
     or v_session_created_at is null
     or v_session_created_at < pg_catalog.now()-interval '15 minutes'
     or v_session_created_at > pg_catalog.now()+interval '60 seconds'
     or (v_session_not_after is not null and v_session_not_after <= pg_catalog.now()) then
    raise exception 'Recent authentication required to delete learning history'
      using errcode='42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,0));

  -- Quiz sessions cascade to their question snapshots; preserve the
  -- pre-2.5.0 account-level deletion behaviour.
  delete from private.quiz_sessions where user_id=v_user;
  delete from public.daily_activity_sessions where user_id=v_user;
  delete from public.lesson_practice_results where user_id=v_user;
  delete from public.lesson_progress where user_id=v_user;
  delete from public.learning_activity_log where user_id=v_user;
  delete from private.flashcard_sessions where user_id=v_user;
  delete from private.flashcard_mastery where user_id=v_user;
  delete from private.flashcard_review_items where user_id=v_user;

  return pg_catalog.jsonb_build_object('deleted',true);
end;
$function$;
commit;
