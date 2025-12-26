import google.generativeai as genai
import os
import sys
from pathlib import Path

# Add backend directory to sys.path to allow imports from app
sys.path.append(str(Path(__file__).parent))

from app.core.config import settings

def verify_connection():
    print("----------------------------------------------------------------")
    print("Verifying Gemini API Connection")
    print("----------------------------------------------------------------")

    # Try to use the list of keys first (as the app does)
    if settings.GEMINI_KEYS:
        print(f"Found {len(settings.GEMINI_KEYS)} keys in settings.GEMINI_KEYS")
        api_key = settings.GEMINI_KEYS[0]
    else:
        print("No keys in settings.GEMINI_KEYS, falling back to GEMINI_API_KEY")
        api_key = settings.GEMINI_API_KEY

    if not api_key:
        print("ERROR: No API keys found.")
        return

    print(f"Using API Key: {'*' * (len(api_key)-4) + api_key[-4:]} (Length: {len(api_key)})")
    
    try:
        genai.configure(api_key=api_key)
        
        print("Listing available models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
        
        # Using the updated model name
        model_name = 'gemini-flash-latest'
        print(f"Attempting to initialize model: {model_name}")
        model = genai.GenerativeModel(model_name)
        
        print("Sending test prompt: 'Hello, are you online?'")
        response = model.generate_content("Hello, are you online?")
        
        print("Response received!")
        print(f"Text: {response.text}")
        print("----------------------------------------------------------------")
        print("VERIFICATION SUCCESSFUL")
        print("----------------------------------------------------------------")
        
    except Exception as e:
        print("----------------------------------------------------------------")
        print("VERIFICATION FAILED")
        print(f"Error: {str(e)}")
        print("----------------------------------------------------------------")

if __name__ == "__main__":
    verify_connection()
