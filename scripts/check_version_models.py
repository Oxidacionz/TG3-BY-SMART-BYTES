import google.generativeai as genai
import sys

print(f"Library version: {genai.__version__}")

try:
    with open("backend/GEMINI_API_KEYS.txt", "r") as f:
        content = f.read()
        import re
        keys = re.findall(r"AIza[0-9A-Za-z-_]{35}", content)
        if keys:
            key = keys[0]
            genai.configure(api_key=key)
            print("Key configured.")
        else:
            print("No keys found.")
            sys.exit(1)
            
    print("Listing available models...")
    for m in genai.list_models():
        print(f"Name: {m.name}")
        print(f"Supported methods: {m.supported_generation_methods}")
        
except Exception as e:
    print(f"Error: {e}")
