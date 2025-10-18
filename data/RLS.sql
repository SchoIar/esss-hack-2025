alter table campus      enable row level security;
alter table building    enable row level security;
alter table desk        enable row level security;
alter table item        enable row level security;
alter table item_photo  enable row level security;

create policy public_read_campus
on campus for select to anon, authenticated using (true);

create policy public_read_building
on building for select to anon, authenticated using (true);

create policy public_read_desk
on desk for select to anon, authenticated using (true);

create policy public_read_item
on item for select to anon, authenticated using (true);

create policy public_read_item_photo
on item_photo for select to anon, authenticated using (true);

create policy staff_write_item
on item
for all to authenticated
using (exists (select 1 from staff_user s where s.id = auth.uid()))
with check (exists (select 1 from staff_user s where s.id = auth.uid()));

create policy staff_write_item_photo
on item_photo
for all to authenticated
using (exists (select 1 from staff_user s where s.id = auth.uid()))
with check (exists (select 1 from staff_user s where s.id = auth.uid()));
