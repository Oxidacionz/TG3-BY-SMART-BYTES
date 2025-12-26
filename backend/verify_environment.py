"""
Environment Verification Script for TG3 Smart Scanner

This script validates the runtime environment before starting the backend server.
It checks:
1. Critical Python dependencies
2. Gemini API key configuration
3. Connectivity to Gemini API
4. File system permissions

Usage: python verify_environment.py
Exit codes: 0 = success, 1 = failure
"""

import sys
import os
from pathlib import Path

# Color codes for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

def print_success(msg):
    print(f"{GREEN}✓ {msg}{RESET}")

def print_error(msg):
    print(f"{RED}✗ {msg}{RESET}")

def print_warning(msg):
    print(f"{YELLOW}⚠ {msg}{RESET}")

def check_dependencies():
    """Verify critical Python packages are installed"""
    print("\n[1/4] Checking Python Dependencies...")
    
    required_packages = [
        "fastapi",
        "uvicorn",
        "pydantic",
        "google.generativeai",
        "PIL",
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace(".", "_") if "." in package else package)
            print_success(f"{package} installed")
        except ImportError:
            print_error(f"{package} NOT FOUND")
            missing.append(package)
    
    if missing:
        print_error(f"Missing packages: {', '.join(missing)}")
        print(f"\nRun: pip install {' '.join(missing)}")
        return False
    
    return True

def check_gemini_keys():
    """Verify Gemini API keys are configured"""
    print("\n[2/4] Checking Gemini API Configuration...")
    
    # Add backend to path
    sys.path.insert(0, str(Path(__file__).parent))
    
    try:
        from app.core.config import settings
        
        if not settings.GEMINI_KEYS:
            print_error("No Gemini API keys found")
            print("  Check: GEMINI_API_KEYS.txt or GEMINI_API_KEYS env var")
            return False
        
        print_success(f"Loaded {len(settings.GEMINI_KEYS)} API key(s)")
        
        # Mask keys for security
        for i, key in enumerate(settings.GEMINI_KEYS, 1):
            masked = f"{key[:8]}...{key[-4:]}"
            print(f"  Key {i}: {masked}")
        
        return True
        
    except Exception as e:
        print_error(f"Configuration error: {e}")
        return False

def check_gemini_connectivity():
    """Test connection to Gemini API"""
    print("\n[3/4] Testing Gemini API Connectivity...")
    
    try:
        from app.services.ai_scanner import SmartScannerService
        
        service = SmartScannerService()
        
        if not service.model:
            print_error("Failed to initialize Gemini model")
            return False
        
        print_success("Gemini model initialized successfully")
        print(f"  Model: models/gemini-flash-latest")
        
        return True
        
    except Exception as e:
        print_error(f"Gemini initialization failed: {e}")
        return False

def check_file_permissions():
    """Verify file system permissions"""
    print("\n[4/4] Checking File System Permissions...")
    
    # Check if we can write to logs directory
    log_dir = Path(__file__).parent / "logs"
    
    try:
        log_dir.mkdir(exist_ok=True)
        test_file = log_dir / ".test_write"
        test_file.write_text("test")
        test_file.unlink()
        print_success("Write permissions OK")
        return True
    except Exception as e:
        print_error(f"Cannot write to logs directory: {e}")
        return False

def main():
    print("=" * 60)
    print("TG3 Smart Scanner - Environment Verification")
    print("=" * 60)
    
    checks = [
        check_dependencies,
        check_gemini_keys,
        check_gemini_connectivity,
        check_file_permissions,
    ]
    
    results = [check() for check in checks]
    
    print("\n" + "=" * 60)
    if all(results):
        print_success("All checks passed! Environment is ready.")
        print("=" * 60)
        return 0
    else:
        print_error("Some checks failed. Please fix the issues above.")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())
