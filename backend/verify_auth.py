import requests

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    # 1. Create User
    user_data = {
        "email": "test_user_phase2@iosh.lk",
        "password": "securepassword",
        "full_name": "Test Phase Two",
        "role": "member"
    }
    
    print("1. Creating User...")
    try:
        resp = requests.post(f"{BASE_URL}/users/", json=user_data)
        if resp.status_code == 200:
            print("   Success:", resp.json())
        elif resp.status_code == 400 and "already registered" in resp.text:
             print("   User already exists (skipping creation)")
        else:
            print("   Failed:", resp.text)
            return
    except Exception as e:
        print("   Connection failed. Is backend running?", e)
        return

    # 2. Login (Get Token)
    print("\n2. Logging in...")
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    resp = requests.post(f"{BASE_URL}/token", data=login_data)
    if resp.status_code != 200:
        print("   Login Failed:", resp.text)
        return
    
    token_data = resp.json()
    access_token = token_data["access_token"]
    print("   Success. Token obtained.")

    # 3. Get Me (Protected Route)
    print("\n3. Accessing Protected Route (/users/me)...")
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(f"{BASE_URL}/users/me", headers=headers)
    if resp.status_code == 200:
        print("   Success. User Data:", resp.json())
    else:
        print("   Failed:", resp.text)

if __name__ == "__main__":
    test_auth_flow()
