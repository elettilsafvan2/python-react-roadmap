"""
Supabase Python Client Example
Connects directly to your Supabase PostgreSQL project using standard Python libraries.
"""

import json
import urllib.request

SUPABASE_URL = "https://gtjcynyvarlwzbnrabos.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0amN5bnl2YXJsd3pibnJhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMTY4MjgsImV4cCI6MjEwNTY5MjgyOH0.tHKutDalGg2Kzflo53mdypTRgOdyljyh5iL4oMbV59M"


def get_user_progress():
    """Fetch user progress from the user_progress table."""
    url = f"{SUPABASE_URL}/rest/v1/user_progress?id=eq.default_user"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))


def update_completed_modules(completed_list):
    """Update completed modules in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/user_progress?id=eq.default_user"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    payload = json.dumps({"completed_days": completed_list}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=headers, method="PATCH")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))


if __name__ == "__main__":
    print("⚡ Connecting to Supabase Project: Python + React Fullstack Roadmap...")
    data = get_user_progress()
    print("✅ Connection Successful!")
    print("Cloud Progress Record:")
    print(json.dumps(data, indent=2))
