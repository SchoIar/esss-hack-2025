# create_item_as_admin_lookup_desk.py
import uuid, mimetypes, sys, os
from supabase import create_client, Client
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
DESK_NAME = os.getenv("DESK_NAME")
LOCAL_PHOTO = os.getenv("LOCAL_PHOTO")

# Use service_role key if provided (bypasses RLS and schema cache issues)
API_KEY = SUPABASE_SERVICE_KEY if SUPABASE_SERVICE_KEY else SUPABASE_ANON_KEY
supabase: Client = create_client(SUPABASE_URL, API_KEY)

# 1) Login
auth = supabase.auth.sign_in_with_password({"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
if not getattr(auth, "user", None):
    sys.exit("Login failed")
print("User UUID:", auth.user.id)

# 2) Small helper to retry a query a few times (handles PGRST002)
def with_retry(fn, attempts=5, delay=0.6):
    last_err = None
    for i in range(attempts):
        try:
            return fn()
        except Exception as e:
            last_err = e
            time.sleep(delay)
    raise last_err

# 1.5) User is already registered as staff in the database
user_id = auth.user.id
print("User is authenticated as staff")

# 3) Lookup the desk id by name (explicitly set schema('public'))
def fetch_desk():
    return (
        supabase.schema("public")
        .table("desk")
        .select("id,name")
        .eq("name", DESK_NAME)
        .limit(1)
        .execute()
    )

desk_res = with_retry(fetch_desk)
if not desk_res.data:
    sys.exit(f"Desk named '{DESK_NAME}' not found. Seed it first.")
DESK_ID = desk_res.data[0]["id"]
print("Using desk:", DESK_NAME, DESK_ID)

# 4) Create the item (RLS allows because you’re logged in as staff)
item_payload = {
    "desk_id": DESK_ID,
    "title": "Raccoon sticker",
    "description": "Raccoon sticker set",
    "category": "Accessories",
    "found_date": "2025-10-18",
    "found_location_text": "AQ north entrance",
}
item_res = with_retry(lambda: supabase.table("item").insert(item_payload).execute())
item_id = item_res.data[0]["id"]
print("Created item:", item_id)

# 5) Upload photo to bucket 'items'
ctype = mimetypes.guess_type(LOCAL_PHOTO)[0] or "image/jpeg"
storage_key = f"{item_id}/{uuid.uuid4()}.jpg"
with open(LOCAL_PHOTO, "rb") as f:
    up = with_retry(lambda: supabase.storage.from_("items").upload(storage_key, f, {"content-type": ctype}))
    if isinstance(up, dict) and up.get("error"):
        sys.exit(f"Upload error: {up['error']}")

# 6) Register photo in DB
db_path = f"items/{storage_key}"
with_retry(lambda: supabase.table("item_photo").insert({"item_id": item_id, "path": db_path, "sort_order": 0}).execute())

# 7) Print public URL
pub = supabase.storage.from_("items").get_public_url(storage_key)
print("Public image URL:", pub)
print("Done.")