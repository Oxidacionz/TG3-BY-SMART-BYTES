"""
Script de diagnóstico para verificar la configuración del scanner Gemini.
Verifica qué modelo está siendo usado y si hay alguna discrepancia.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).parent))

def diagnose():
    print("=" * 70)
    print("DIAGNÓSTICO DE CONFIGURACIÓN DEL SCANNER GEMINI")
    print("=" * 70)
    
    # 1. Verificar configuración en settings
    print("\n1. Verificando configuración en settings...")
    try:
        from app.core.config import settings
        print(f"   ✓ GEMINI_SCANNER_MODEL_NAME: {settings.GEMINI_SCANNER_MODEL_NAME}")
        print(f"   ✓ Total API Keys: {len(settings.GEMINI_KEYS)}")
    except Exception as e:
        print(f"   ✗ Error cargando settings: {e}")
    
    # 2. Verificar configuración modular
    print("\n2. Verificando configuración modular (src/shared/config)...")
    try:
        from src.shared.config.settings import settings as mod_settings
        print(f"   ✓ GEMINI_SCANNER_MODEL_NAME: {mod_settings.GEMINI_SCANNER_MODEL_NAME}")
        print(f"   ✓ Total API Keys: {len(mod_settings.GEMINI_KEYS)}")
    except Exception as e:
        print(f"   ✗ Error cargando settings modular: {e}")
    
    # 3. Verificar GeminiScannerService (app/services)
    print("\n3. Verificando GeminiScannerService (app/services)...")
    try:
        from app.services.gemini_scanner import GeminiAPIClient
        # Inspeccionar el default del __init__
        import inspect
        sig = inspect.signature(GeminiAPIClient.__init__)
        model_param = sig.parameters.get('model_name')
        if model_param:
            print(f"   ✓ Default model_name en GeminiAPIClient: {model_param.default}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # 4. Verificar scanner modular (src/scanner)
    print("\n4. Verificando scanner modular (src/scanner)...")
    try:
        from src.scanner.application.scanner_service import scanner_service
        print(f"   ✓ Scanner service cargado correctamente")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # 5. Verificar qué endpoint está activo
    print("\n5. Verificando endpoints activos...")
    try:
        from app.main import app
        routes = []
        for route in app.routes:
            if hasattr(route, 'path') and 'scanner' in route.path.lower():
                routes.append(route.path)
        print(f"   ✓ Rutas de scanner encontradas:")
        for route in routes:
            print(f"     - {route}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # 6. Probar creación de cliente
    print("\n6. Probando creación de GeminiAPIClient...")
    try:
        from app.services.gemini_scanner import GeminiAPIClient
        client = GeminiAPIClient()
        print(f"   ✓ Cliente creado con modelo: {client.model_name}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print("\n" + "=" * 70)
    print("DIAGNÓSTICO COMPLETADO")
    print("=" * 70)

if __name__ == "__main__":
    diagnose()
