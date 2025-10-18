--  pub can read
create policy "public read items bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'items');

-- Staff-only write/update/delete perms 
create policy "staff insert items"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'items'
  and exists (select 1 from staff_user s where s.id = auth.uid())
);

create policy "staff update items"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'items'
  and exists (select 1 from staff_user s where s.id = auth.uid())
)
with check (
  bucket_id = 'items'
  and exists (select 1 from staff_user s where s.id = auth.uid())
);

create policy "staff delete items"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'items'
  and exists (select 1 from staff_user s where s.id = auth.uid())
);
