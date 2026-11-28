-- Correct release-note version matching without backslash escaping ambiguity.
begin;

alter table public.learning_page_introduction_preferences
  drop constraint if exists learning_page_introduction_preferences_page_key_check;

alter table public.learning_page_introduction_preferences
  add constraint learning_page_introduction_preferences_page_key_check
  check (
    page_key in ('lessons','quiz','flashcards')
    or page_key ~ '^release:[0-9]+[.][0-9]+[.][0-9]+$'
  );

do $assert$
begin
  if not ('release:3.0.0' ~ '^release:[0-9]+[.][0-9]+[.][0-9]+$')
     or ('release:3x0y0' ~ '^release:[0-9]+[.][0-9]+[.][0-9]+$') then
    raise exception 'Release-note semver matcher regression';
  end if;
end;
$assert$;

commit;
