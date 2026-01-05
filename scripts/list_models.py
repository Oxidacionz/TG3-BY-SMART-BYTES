import google.generativeai as genai
import os

print("Checking API Keys...")
key = None
try:
    with open("GEMINI_API_KEYS.txt", "r") as f:
        content = f.read()
        if "AIza" in content:
            # Extract basic key
            import re
            match = re.search(r"AIza[a-zA-Z0-9_\-]+", content)
            if match:
                key = match.group(0)
except Exception as e:
    print(f"Error reading file: {e}")

if not key:
    print("No API Key found in file.")
else:
    print(f"Found key: {key[:5]}...")
    genai.configure(api_key=key)
    
    print("Listing models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Model: {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
