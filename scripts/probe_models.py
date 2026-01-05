import google.generativeai as genai
import os
import sys

# Load API key
try:
    with open("backend/GEMINI_API_KEYS.txt", "r") as f:
        # Get first key that looks like a key
        content = f.read()
        import re
        keys = re.findall(r"AIza[0-9A-Za-z-_]{35}", content)
        if keys:
            key = keys[0]
            print(f"Using key: {key[:10]}...")
            genai.configure(api_key=key)
        else:
            print("No AIza keys found in file")
            sys.exit(1)
except Exception as e:
    print(f"Error loading key: {e}")
    sys.exit(1)

models_to_test = [
    "models/gemini-1.5-flash", 
    "models/gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-1.0-pro-vision-latest",
    "gemini-pro-vision"
]

print("Probing models...")
for m in models_to_test:
    print(f"Testing {m}...")
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("Hello")
        print(f"   SUCCESS: {m}")
        break
    except Exception as e:
        print(f"   FAIL: {m} - {str(e)[:100]}...")
