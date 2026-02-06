import requests

BASE_URL = "http://localhost:8000"

def test_public_verification():
    # 1. Login as Admin to create a cert
    print("1. Creating Certificate for Verification...")
    resp = requests.post(f"{BASE_URL}/token", data={"username": "admin@iosh.lk", "password": "password"})
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    cert_id = "PUB-VERIFY-001"
    requests.post(f"{BASE_URL}/certificates/", json={
        "cert_id": cert_id,
        "type": "professional",
        "expiry_date": "2028-05-20",
        "owner_email": "admin@iosh.lk"
    }, headers=headers)

    # 2. Verify Publicly (No Auth Header)
    print("\n2. Verifying Publicly...")
    url = f"{BASE_URL}/public/verify/{cert_id}"
    resp = requests.get(url)
    
    if resp.status_code == 200:
        data = resp.json()
        print("   Success: Certificate Found!")
        print("   Details:", data)
    else:
        print("   Failed:", resp.text)

if __name__ == "__main__":
    test_public_verification()
