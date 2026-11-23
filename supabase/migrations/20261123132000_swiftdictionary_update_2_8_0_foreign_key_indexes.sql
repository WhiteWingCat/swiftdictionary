-- U2.8.0 supporting indexes for foreign-key joins and delete checks.
begin;

create index if not exists quiz_question_bank_translation_language_idx
  on private.quiz_question_bank(translation_language_code);
create index if not exists quiz_sessions_learning_language_idx
  on private.quiz_sessions(learning_language_code);
create index if not exists quiz_sessions_translation_language_idx
  on private.quiz_sessions(translation_language_code);
create index if not exists quiz_session_questions_bank_fk_idx
  on private.quiz_session_questions(question_id,question_revision);
create index if not exists quiz_session_questions_session_fk_idx
  on private.quiz_session_questions(session_id,user_id);
create index if not exists flashcard_session_items_session_fk_idx
  on private.flashcard_session_items(session_id,user_id);
create index if not exists daily_activity_sessions_language_idx
  on public.daily_activity_sessions(language_code);
create index if not exists learning_activity_log_language_idx
  on public.learning_activity_log(language_code);
create index if not exists learning_activity_log_user_idx
  on public.learning_activity_log(user_id);
create index if not exists user_preferences_learning_language_idx
  on public.user_preferences(learning_language);
create index if not exists user_preferences_translation_language_idx
  on public.user_preferences(translation_language);

commit;
