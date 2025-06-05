import requests
import base64
from decouple import config

class KopoKopoHandler:
    def __init__(self):
        self.client_id = config('K2_CLIENT_ID')
        self.client_secret = config('K2_CLIENT_SECRET')
        self.api_key = config('K2_API_KEY')
        self.base_url = config('K2_BASE_URL')
        self.till_number = config('K2_TILL_NUMBER')
        self.callback_url = config('K2_CALLBACK_URL')
        self.access_token = self.get_access_token()

    def get_access_token(self):
        url = f"{self.base_url}/oauth/token"
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_encoded = base64.b64encode(auth_string.encode()).decode()

        headers = {
            "Authorization": f"Basic {auth_encoded}",
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apiKey": self.api_key
        }

        data = {
            "grant_type": "client_credentials"
        }

        res = requests.post(url, data=data, headers=headers)
        res.raise_for_status()
        return res.json().get("access_token")

    def initiate_stk_push(self, first_name, last_name, phone_number, amount, email=None, metadata=None):
        url = f"{self.base_url}/api/v1/merchant/stk-push"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "payment_channel": "M-PESA",
            "till_number": self.till_number,
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "amount": amount,
            "currency": "KES",
            "callback_url": self.callback_url,
            "metadata": metadata or {}
        }

        if email:
            payload["email"] = email

        res = requests.post(url, headers=headers, json=payload)
        res.raise_for_status()
        return res.json()
