
import google.generativeai as genai
import sys
import os

# Load key manually
try:
    with open("GEMINI_API_KEYS.txt", "r") as f:
        content = f.read()
        import re
        keys = re.findall(r"AIza[0-9A-Za-z-_]{35}", content)
        if keys:
            genai.configure(api_key=keys[0])
            print(f"Using key: {keys[0][:10]}...")
        else:
            print("No keys found")
            sys.exit(1)
except Exception as e:
    print(f"Error loading keys: {e}")
    sys.exit(1)

model_name = "models/gemini-flash-latest"
print(f"Testing model: {model_name}")

try:
    model = genai.GenerativeModel(model_name)
    res = model.generate_content("Hello, do you work?")
    print(f"SUCCESS: {res.text}")
except Exception as e:
    print(f"FAIL: {e}")
