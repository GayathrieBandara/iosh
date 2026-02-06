import requests
import datetime

BASE_URL = "http://localhost:8000"

def test_member_flow():
    # 1. Register a Member
    email = "member_phase4@iosh.lk"
    password = "password"
    
    print(f"1. Creating Member: {email}")
    requests.post(f"{BASE_URL}/users/", json={
        "email": email, "password": password, "full_name": "Phase 4 Member", "role": "member"
    })

    # 2. Login as Member
    print("2. Logging in as Member...")
    resp = requests.post(f"{BASE_URL}/token", data={"username": "email" if False else email, "password": password})
    if resp.status_code != 200:
        print("   Login failed:", resp.text)
        return
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Check Certificates (Should be empty initially)
    print("3. Checking Certificates (Expect 0)...")
    resp = requests.get(f"{BASE_URL}/certificates/", headers=headers)
    certs = resp.json()
    print(f"   Count: {len(certs)}")
    
    # 4. Login as Admin to issue a certificate for this member
    print("4. Admin issuing certificate...")
    # Admin login
    admin_resp = requests.post(f"{BASE_URL}/token", data={"username": "admin@iosh.lk", "password": "password"})
    admin_token = admin_resp.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    requests.post(f"{BASE_URL}/certificates/", json={
        "cert_id": "MEM-CERT-004",
        "type": "environmental",
        "expiry_date": "2027-01-01",
        "owner_email": email
    }, headers=admin_headers)
    
    # 5. Check Certificates again as Member
    print("5. Member checking Certificates (Expect 1)...")
    resp = requests.get(f"{BASE_URL}/certificates/", headers=headers)
    certs = resp.json()
    print(f"   Count: {len(certs)}")
    if len(certs) > 0:
        print("   Success: Member can see their certificate!")
        print("   ID:", certs[0]["cert_id"])

if __name__ == "__main__":
    test_member_flow()
