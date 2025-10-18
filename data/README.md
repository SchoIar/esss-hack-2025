# Database Documentation

## Schema Overview

The database is designed to manage lost items across multiple campuses and buildings, with role-based access control for staff members.

### Tables

#### Location Hierarchy
- `campus`: Represents different campuses (name, id)
- `building`: Buildings within campuses (name, campus reference)
- `desk`: Lost and found desks within buildings (name, building reference, pickup instructions)

#### Item Management
- `item`: Lost items with details like:
  - Title and description
  - Category and tags
  - Found date and location
  - Creation and update timestamps
- `item_photo`: Photos of items (stored in Supabase storage)

#### Authentication
- `staff_user`: Staff members with special privileges (linked to Supabase auth)

### Security
- Public can view all items and locations
- Only authenticated staff can create/modify items
- Photos stored in public 'items' bucket with controlled write access

## Supabase Setup Guide

1. **Initial Schema Setup**
   ```sql
   schema.sql  -- Creates tables and extensions
   RLS.sql     -- Sets up Row Level Security policies
   grants.sql  -- Configures permissions
   populate.sql -- Adds initial data
   ```

2. **Admin User Setup**
   - Go to Auth → Users → Add user (email/password)
   - Add admin to staff_user table:
     ```sql
     insert into staff_user (id) values ('<AUTH_USER_UUID>')
     ```

3. **Security Configuration**
   - Enable Row Level Security (RLS)
   - Create public bucket named `items`
   - Run `grants.sql` for proper permissions

4. **API Setup**
   - Enable Data API in project settings
   - URL: https://supabase.com/dashboard/project/{your-project}/settings/api

## Environment Setup (.env)
Required variables for testing/development:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # Optional
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
DESK_NAME=your_desk_name
LOCAL_PHOTO=path_to_test_photo.jpg
```

See [test script](tests/acess.py) for example usage of the API.