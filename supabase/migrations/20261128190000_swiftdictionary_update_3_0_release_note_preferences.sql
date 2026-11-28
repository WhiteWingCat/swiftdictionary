-- SwiftDictionary U3.0: versioned release-note dismissals.
-- Reuse the existing account-scoped introduction preference table so a
-- signed-in learner sees each release prompt only once across their devices.

alter table public.learning_page_introduction_preferences
  drop constraint if exists learning_page_introduction_preferences_page_key_check;

alter table public.learning_page_introduction_preferences
  add constraint learning_page_introduction_preferences_page_key_check
  check (
    page_key in ('lessons', 'quiz', 'flashcards')
    or page_key ~ '^release:[0-9]+\.[0-9]+\.[0-9]+$'
  );
