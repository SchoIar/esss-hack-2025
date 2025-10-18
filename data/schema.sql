-- Extensions (UUID generator)
create extension if not exists pgcrypto;


create table if not exists campus (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists building (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references campus(id) on delete cascade,
  name text not null,
  unique (campus_id, name)
);

create table if not exists desk (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references building(id) on delete cascade,
  name text not null,
  pickup_instructions text,
  unique (building_id, name)
);

-- Items (normalized)
create table if not exists item (
  id uuid primary key default gen_random_uuid(),
  desk_id uuid not null references desk(id) on delete cascade,
  title text not null,
  description text,
  category text,
  tags text[] default '{}',
  found_date date,
  found_location_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Photos (actual items will be stored in buckets; path in path)
create table if not exists item_photo (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references item(id) on delete cascade,
  path text not null, -- e.g. items/<item_id>/<uuid>.jpg
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_item_photo_item on item_photo(item_id, sort_order);

-- Authentication via RLS (staff users - IDs match Supabase auth.users.id)
create table if not exists staff_user (
  id uuid primary key,                          -- auth.users.id
  created_at timestamptz not null default now()
);

alter table staff_user enable row level security;

create policy if not exists staff_read_self on staff_user
for select to authenticated
using (true);
