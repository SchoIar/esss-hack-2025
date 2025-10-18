## Database


# Supabase setup

Run `schema.sql` in SQL editor 
Create your admin user: Auth → Users → Add user (email/password).
Insert their UUID into staff_user ie. `insert into staff_user (id) values ('<AUTH_USER_UUID>')`
Enable RLS
Create public bucket `items`[items.sql]
Add `grants`[grants.sql]
Enable data api (https://supabase.com/dashboard/project/{your proj name}/settings/api)