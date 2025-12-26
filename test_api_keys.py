import google.generativeai as genai
import os
import sys
import time

def test_api():
    print("================================================================")
    print("            TEST DE CONEXION API GEMINI - TG3")
    print("================================================================")

    # 1. Cargar Claves
    print("\n[1] Cargando claves de API...")
    keys = []
    try:
        keys_path = os.path.join("backend", "GEMINI_API_KEYS.txt")
        if not os.path.exists(keys_path):
            keys_path = "GEMINI_API_KEYS.txt" # Intento en raiz
            
        with open(keys_path, "r") as f:
            content = f.read()
            import re
            # Busca claves que empiecen por AIza
            keys = re.findall(r"AIza[0-9A-Za-z-_]{35}", content)
            
        if not keys:
            print(" [ERROR] No se encontraron claves en GEMINI_API_KEYS.txt")
            return
            
        print(f" [OK] Se encontraron {len(keys)} claves disponibles.")
        
    except Exception as e:
        print(f" [ERROR] al leer archivo de claves: {e}")
        return

    # 2. Configurar Modelo
    model_name = "gemini-flash-latest"
    print(f"\n[2] Probando modelo: {model_name}")

    success_count = 0
    
    # 3. Probar cada clave
    for i, api_key in enumerate(keys):
        print(f"\n--- Probando Clave #{i+1} ({api_key[:10]}...) ---")
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(model_name)
            
            start_time = time.time()
            response = model.generate_content("Responde solo con la palabra: OK")
            elapsed = time.time() - start_time
            
            print(f" [OK] EXITO! Respuesta recibida en {elapsed:.2f}s")
            print(f"   Respuesta IA: {response.text.strip()}")
            success_count += 1
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "Quota" in error_msg:
                 print(f" [QUOTA] CUOTA EXCEDIDA (429) para esta clave.")
            elif "not found" in error_msg or "404" in error_msg:
                 print(f" [ERROR] MODELO NO ENCONTRADO. Tu clave no soporta '{model_name}'.")
            else:
                 print(f" [ERROR]: {error_msg}")

    print("\n================================================================")
    print(f"RESUMEN: {success_count} de {len(keys)} claves funcionaron correctamente.")
    
    if success_count > 0:
        print(" [OK] El sistema de escaner deberia funcionar correctamente.")
    else:
        print(" [FAIL] Todas las claves fallaron. Revisa tu cuota en Google AI Studio.")
    print("================================================================")

if __name__ == "__main__":
    test_api()
