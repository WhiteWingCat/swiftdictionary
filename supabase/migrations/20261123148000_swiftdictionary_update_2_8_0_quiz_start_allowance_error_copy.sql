-- Align legacy Quiz RPC error text with start-based allowance charging.
do $$
declare v_oid oid; v_definition text;
begin
  for v_oid in
    select p.oid
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='private' and p.prokind='f'
      and p.proname in ('start_my_quiz_impl','start_my_chinese_quiz_impl')
  loop
    v_definition:=pg_catalog.pg_get_functiondef(v_oid);
    v_definition:=replace(v_definition,'Daily Quiz completion allowance exhausted','Daily Quiz allowance exhausted');
    execute v_definition;
  end loop;
end $$;