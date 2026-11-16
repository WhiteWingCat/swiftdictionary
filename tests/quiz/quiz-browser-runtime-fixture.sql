-- Disposable-only approval of the reviewed draft pack for authenticated browser tests.
-- This file must only run against the local Supabase stack in CI.
-- It promotes the real 114-question content pack inside the disposable test DB;
-- no production database or persistent environment is touched.

\set ON_ERROR_STOP on

update private.quiz_question_bank
set status='approved', approved_at=pg_catalog.now()
where question_id like 'quiz-beginner-%'
   or question_id like 'quiz-intermediate-%'
   or question_id like 'quiz-advanced-%';

do $assert_runtime_bank$
declare
  v_beginner integer;
  v_intermediate integer;
  v_advanced integer;
  v_not_approved integer;
begin
  select count(*) filter (where difficulty='beginner')::integer,
         count(*) filter (where difficulty='intermediate')::integer,
         count(*) filter (where difficulty='advanced')::integer,
         count(*) filter (where status<>'approved')::integer
  into v_beginner,v_intermediate,v_advanced,v_not_approved
  from private.quiz_question_bank
  where question_id like 'quiz-beginner-%'
     or question_id like 'quiz-intermediate-%'
     or question_id like 'quiz-advanced-%';

  if v_beginner<>30 or v_intermediate<>36 or v_advanced<>48 or v_not_approved<>0 then
    raise exception 'Disposable runtime bank promotion failed: beginner %, intermediate %, advanced %, unapproved %',
      v_beginner,v_intermediate,v_advanced,v_not_approved;
  end if;
  raise notice 'Disposable runtime bank ready: 114 real bilingual questions approved only in local test database';
end;
$assert_runtime_bank$;
