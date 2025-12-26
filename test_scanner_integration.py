import requests
import os

# Configuración
API_URL = "http://localhost:8001/api/v1/scanner/"
# Ruta de la imagen que subiste
IMAGE_PATH = r"C:/Users/oxz/.gemini/antigravity/brain/6b943667-a64d-45dc-8b50-4aa5197dc806/uploaded_image_1766458878777.jpg"

def test_scanner():
    print(f"🚀 Iniciando prueba de escaneo con: {os.path.basename(IMAGE_PATH)}")
    
    if not os.path.exists(IMAGE_PATH):
        print("❌ Error: No encuentro la imagen en la ruta especificada.")
        return

    try:
        with open(IMAGE_PATH, 'rb') as f:
            files = {'file': ('receipt.jpg', f, 'image/jpeg')}
            print("📡 Enviando solicitud a POST /api/v1/scanner/ ...")
            
            response = requests.post(API_URL, files=files)
            
            if response.status_code == 200:
                print("\n✅ ¡ÉXITO! Respuesta del Servidor:")
                data = response.json()
                print("-" * 30)
                print(f"💰 Monto:   {data.get('amount')} {data.get('currency')}")
                print(f"🏦 Banco:   {data.get('platform')}")
                print(f"🔖 Ref:     {data.get('reference_id')}")
                print(f"📅 Fecha:   {data.get('transaction_date')}")
                print(f"🚦 Estado:  {data.get('status')}")
                print("-" * 30)
            else:
                print(f"\n❌ Falla del servidor (Status {response.status_code}):")
                print(response.text)
                
    except Exception as e:
        print(f"\n❌ Error de conexión: {e}")
        print("Asegúrate de que el backend en el puerto 8001 esté corriendo.")

if __name__ == "__main__":
    test_scanner()
