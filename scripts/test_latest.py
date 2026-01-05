import google.generativeai as genai
import sys
import os

# Load key manually
try:
    with open("backend/GEMINI_API_KEYS.txt", "r") as f:
        content = f.read()
        import re
        keys = re.findall(r"AIza[0-9A-Za-z-_]{35}", content)
        if keys:
            genai.configure(api_key=keys[0])
        else:
            sys.exit(1)
except:
    sys.exit(1)

models = ["models/gemini-flash-latest", "gemini-flash-latest"]

print("Testing LATEST models...")
for m in models:
    print(f"Testing {m}...")
    try:
        model = genai.GenerativeModel(m)
        res = model.generate_content("Hi")
        print(f"SUCCESS: {m}")
    except Exception as e:
        print(f"FAIL: {m} - {e}")
