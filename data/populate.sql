begin;

truncate table
  public.item_photo,
  public.item,
  public.desk,
  public.building,
  public.campus,
  public.staff_user
restart identity cascade;

-- Campuses
with c as (
  insert into campus (name) values
    ('SFU Burnaby Campus')
  returning id, name
),

-- Buildings (from your map; use official names where common)
b as (
  insert into building (campus_id, name) values
    ((select id from c where name='SFU Burnaby Campus'), 'Academic Quadrangle (AQ)'),
    ((select id from c where name='SFU Burnaby Campus'), 'W.A.C. Bennett Library'),
    ((select id from c where name='SFU Burnaby Campus'), 'Maggie Benston Centre (MBC)'),
    ((select id from c where name='SFU Burnaby Campus'), 'Transportation Centre'),
    ((select id from c where name='SFU Burnaby Campus'), 'Campus Security'),
    ((select id from c where name='SFU Burnaby Campus'), 'West Mall Centre (WMC)'),
    ((select id from c where name='SFU Burnaby Campus'), 'Robert C. Brown Hall'),
    ((select id from c where name='SFU Burnaby Campus'), 'Education Building'),
    ((select id from c where name='SFU Burnaby Campus'), 'Saywell Hall'),
    ((select id from c where name='SFU Burnaby Campus'), 'Blusson Hall'),
    ((select id from c where name='SFU Burnaby Campus'), 'Strand Hall'),
    ((select id from c where name='SFU Burnaby Campus'), 'SFU Art Museum'),
    ((select id from c where name='SFU Burnaby Campus'), 'Shrum Science – Chemistry'),
    ((select id from c where name='SFU Burnaby Campus'), 'Shrum Science – BPK'),
    ((select id from c where name='SFU Burnaby Campus'), 'Shrum Science – Physics'),
    ((select id from c where name='SFU Burnaby Campus'), 'Applied Science Building'),
    ((select id from c where name='SFU Burnaby Campus'), 'Kinesiology Building'),
    ((select id from c where name='SFU Burnaby Campus'), 'South Sciences Building'),
    ((select id from c where name='SFU Burnaby Campus'), 'Technology and Science Complex 1 (TASC 1)'),
    ((select id from c where name='SFU Burnaby Campus'), 'Technology and Science Complex 2 (TASC 2)'),
    ((select id from c where name='SFU Burnaby Campus'), 'Lorne Davies Complex'),
    ((select id from c where name='SFU Burnaby Campus'), 'Terry Fox Field')
  returning id, name
),

-- Desks (pickup points) with simple instructions
d as (
  insert into desk (building_id, name, pickup_instructions) values
    ((select id from b where name='Academic Quadrangle (AQ)'),         'AQ Security Desk',             'Bring photo ID. Level 300, SE corner.'),
    ((select id from b where name='W.A.C. Bennett Library'),           'Library Loans/Info Desk',      'North entrance, main floor.'),
    ((select id from b where name='Maggie Benston Centre (MBC)'),      'MBC Info Desk',                'Across from food court.'),
    ((select id from b where name='Campus Security'),                  'Campus Security (Central)',    '24/7 window. Photo ID required.'),
    ((select id from b where name='West Mall Centre (WMC)'),           'WMC Info Desk',                'Ground level, by WMC Walkway.'),
    ((select id from b where name='Robert C. Brown Hall'),             'RCB General Office',           'Room 7200, Mon–Fri 9–4.'),
    ((select id from b where name='Education Building'),               'Education Office',             'Main lobby counter.'),
    ((select id from b where name='Saywell Hall'),                     'Saywell Reception',            'Level 100, south lobby.'),
    ((select id from b where name='Blusson Hall'),                     'Blusson Reception',            'Main entrance desk.'),
    ((select id from b where name='Strand Hall'),                      'Strand Hall Reception',        'Room 2090.'),
    ((select id from b where name='SFU Art Museum'),                   'Art Museum Front Desk',        'Ticket counter.'),
    ((select id from b where name='Shrum Science – Chemistry'),        'SSC General Office',           'South Science Hallway.'),
    ((select id from b where name='Shrum Science – BPK'),              'SSBPK Office',                 'South Science Hallway.'),
    ((select id from b where name='Shrum Science – Physics'),          'SSPHY Office',                 'South Science Hallway.'),
    ((select id from b where name='Applied Science Building'),         'Applied Science Office',       'By Applied Science Walkway.'),
    ((select id from b where name='Kinesiology Building'),             'Kinesiology Office',           'Main lobby counter.'),
    ((select id from b where name='South Sciences Building'),          'South Sciences Reception',     'Ground floor.'),
    ((select id from b where name='Technology and Science Complex 1 (TASC 1)'), 'TASC 1 Front Desk', 'Lobby, west entrance.'),
    ((select id from b where name='Technology and Science Complex 2 (TASC 2)'), 'TASC 2 Front Desk', 'Lobby, east entrance.'),
    ((select id from b where name='Lorne Davies Complex'),             'LDC Equipment Desk',           'By gym entrance.')
  returning id, name
),

-- Seed staff user
s as (
  insert into staff_user (id)
  values ('7ad2717f-3c95-4413-9770-6ad2774e69e5')
  on conflict (id) do nothing
  returning id
),

-- Sample items
i as (
  insert into item (desk_id, title, description, category, tags, found_date, found_location_text)
  values
    ((select id from d where name='AQ Security Desk'),             'Black Umbrella',          'Collapsible, rubber handle',               'Other', array['umbrella','black'],     current_date - 1, 'AQ, east stairs'),
    ((select id from d where name='Library Loans/Info Desk'),      'MacBook Charger (USB-C)', 'Apple 67W, white brick',                    'Electronics', array['charger','usb-c'],       current_date - 2, 'Library, quiet study area'),
    ((select id from d where name='LDC Equipment Desk'),           'Water Bottle (Team SFU)', 'Red, scratched logo',                         'Other',      array['bottle','red'],           current_date - 2, 'Lorne Davies gym bleachers')
  returning id, title
)

select * from i;

select pg_notify('pgrst','reload schema');
commit;
