grant usage on schema public to anon, authenticated;

grant select on campus      to anon, authenticated;
grant select on building    to anon, authenticated;
grant select on desk        to anon, authenticated;
grant select on item        to anon, authenticated;
grant select on item_photo  to anon, authenticated;
grant select on staff_user  to authenticated;

grant all on item       to authenticated;
grant all on item_photo to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;

-- Force PostgREST to reload schema cache
select pg_notify('pgrst','reload schema');
