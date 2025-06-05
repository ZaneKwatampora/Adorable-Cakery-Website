import time
import math
import base64
import requests
from datetime import datetime
from requests.auth import HTTPBasicAuth
from decouple import config

class MpesaHandler:
    def __init__(self):
        self.now = datetime.now()
        self.shortcode = config("SAF_SHORTCODE")
        self.consumer_key = config("SAF_CONSUMER_KEY")
        self.consumer_secret = config("SAF_CONSUMER_SECRET")
        self.access_token_url = config("SAF_ACCESS_TOKEN_API")
        self.passkey = config("SAF_PASS_KEY")
        self.stk_push_url = config("SAF_STK_PUSH_API")
        self.my_callback_url = config("CALLBACK_URL")
        self.password = self.generate_password()
        self.access_token = self.get_mpesa_access_token()
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

    def get_mpesa_access_token(self):
        try:
            res = requests.get(
                self.access_token_url,
                auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret),
            )
            res.raise_for_status()
            return res.json().get('access_token')
        except Exception as e:
            print(f"Error getting token: {str(e)}")
            raise e

    def generate_password(self):
        self.timestamp = self.now.strftime("%Y%m%d%H%M%S")
        data = f"{self.shortcode}{self.passkey}{self.timestamp}"
        return base64.b64encode(data.encode()).decode('utf-8')

    def format_phone_number(self, phone_number):
        phone = str(phone_number).strip().replace(" ", "")
        if phone.startswith("0"):
            return "254" + phone[1:]
        elif phone.startswith("+"):
            return phone[1:]
        elif phone.startswith("254"):
            return phone
        else:
            raise ValueError("Invalid Kenyan phone number format")

    def make_stk_push(self, order):
        try:
            print(f"Order ID: {order.id}")
            print(f"Order Total Price (raw): {order.total_price}")

            phone = self.format_phone_number(order.user.phone)
            amount = math.ceil(float(order.total_price))

            if amount <= 0:
                raise ValueError("Order amount must be greater than 0")

            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": self.password,
                "Timestamp": self.timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": self.shortcode,
                "PhoneNumber": phone,
                "CallBackURL": self.my_callback_url,
                "AccountReference": f"Order{order.id}",
                "TransactionDesc": "Payment"
            }

            print("M-PESA Payload:", payload)

            response = requests.post(
                self.stk_push_url,
                json=payload,
                headers=self.headers,
                timeout=30
            )

            print("M-PESA Raw Response:", response.text)
            response.raise_for_status()
            return response.json()

        except Exception as e:
            raise Exception(f"MPesa API Error: {str(e)}")
