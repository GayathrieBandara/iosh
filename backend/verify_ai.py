import requests

BASE_URL = "http://localhost:8000"

def test_ai():
    # 1. Login
    login_data = {"username": "admin@iosh.lk", "password": "password"}
    resp = requests.post(f"{BASE_URL}/token", data=login_data)
    if resp.status_code != 200:
        print("Login failed")
        return
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Predict High Risk
    print("Testing High Risk Scenario...")
    data_high = {"employees": 500, "accidents": 20, "training_hours": 10}
    resp = requests.post(f"{BASE_URL}/predict", json=data_high, headers=headers)
    print("Response:", resp.json())

    # 3. Predict Low Risk
    print("\nTesting Low Risk Scenario...")
    data_low = {"employees": 50, "accidents": 0, "training_hours": 100}
    resp = requests.post(f"{BASE_URL}/predict", json=data_low, headers=headers)
    print("Response:", resp.json())

if __name__ == "__main__":
    test_ai()
