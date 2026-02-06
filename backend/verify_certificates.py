import requests
import json

BASE_URL = "http://localhost:8000"

def test_certificate_flow():
    # 1. Login as Admin
    # Note: Assumes the admin user from previous step exists. If not, re-create or handle error.
    login_data = {"username": "admin@iosh.lk", "password": "password"}
    print("1. Logging in as Admin...")
    
    resp = requests.post(f"{BASE_URL}/token", data=login_data)
    if resp.status_code != 200:
        # Create user if missing
        print("   User not found, creating...")
        requests.post(f"{BASE_URL}/users/", json={
            "email": "admin@iosh.lk", "password": "password", "full_name": "Admin User", "role": "admin"
        })
        resp = requests.post(f"{BASE_URL}/token", data=login_data)
    
    if resp.status_code != 200:
        print("   Login Failed:", resp.text)
        return

    access_token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    print("   Success. Token obtained.")

    # 2. Create Certificate
    print("\n2. Creating Certificate...")
    cert_data = {
        "cert_id": "TEST-CERT-001",
        "type": "medical",
        "expiry_date": "2026-12-31",
        "owner_email": "admin@iosh.lk"  # Assigning to self for test
    }
    
    resp = requests.post(f"{BASE_URL}/certificates/", json=cert_data, headers=headers)
    if resp.status_code == 200:
        print("   Success:", resp.json())
    else:
        print("   Failed:", resp.text)

    # 3. List Certificates
    print("\n3. Listing Certificates...")
    resp = requests.get(f"{BASE_URL}/certificates/", headers=headers)
    print("   Count:", len(resp.json()))

    # 4. Get Stats
    print("\n4. Getting Stats...")
    resp = requests.get(f"{BASE_URL}/stats", headers=headers)
    print("   Stats:", resp.json())

if __name__ == "__main__":
    test_certificate_flow()
