begin;

truncate table
  public.item_photo,
  public.item,
  public.desk,
  public.building,
  public.campus,
  public.staff_user
restart identity cascade;

with c as (
  insert into campus (name) values
    ('Main Campus'),
    ('Downtown Campus')
  returning id, name
),
b as (
  insert into building (campus_id, name) values
    ((select id from c where name = 'Main Campus'),   'AQ'),
    ((select id from c where name = 'Main Campus'),   'Library'),
    ((select id from c where name = 'Downtown Campus'),'Harbour Centre')
  returning id, name
),
d as (
  insert into desk (building_id, name, pickup_instructions) values
    ((select id from b where name = 'AQ'),             'AQ Security Desk',    'Bring photo ID'),
    ((select id from b where name = 'Library'),        'Library Info Desk',   'North entrance'),
    ((select id from b where name = 'Harbour Centre'), 'HC Welcome Desk',     'Room 100')
  returning id, name
),
s as (
  insert into staff_user (id)
  values ('7ad2717f-3c95-4413-9770-6ad2774e69e5')  -- your UUID
  on conflict (id) do nothing
  returning id
),
i as (
  insert into item (desk_id, title, description, category, tags, found_date, found_location_text)
  values
    ((select id from d where name='AQ Security Desk'), 'Black Umbrella',     'Collapsible, rubber handle', 'Umbrella',    array['black','umbrella'],  current_date - 1, 'Outside AQ'),
    ((select id from d where name='AQ Security Desk'), 'Blue Water Bottle',  '1L Nalgene',                 'Bottle',      array['blue','nalgene'],    current_date - 2, 'AQ level 3'),
    ((select id from d where name='Library Info Desk'),'MacBook Charger',    'USB-C 67W',                  'Electronics', array['charger','usb-c'],   current_date - 3, 'Quiet study area')
  returning id, title
)

-- TODO: image insert

-- Force the CTEs to execute and show what got inserted:
select * from i;

select pg_notify('pgrst','reload schema');
commit;
