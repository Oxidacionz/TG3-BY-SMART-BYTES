import requests

files = {"file": ("test.txt", b"hello", "text/plain")}
headers = {"X-API-Key": "dev-secret-key"}
try:
    resp = requests.post("http://127.0.0.1:8001/api/v1/process-ocr", files=files, headers=headers, timeout=10)
    print('STATUS', resp.status_code)
    print(resp.text)
except Exception as e:
    print('ERROR', repr(e))
