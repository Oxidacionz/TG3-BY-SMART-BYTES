Run instructions (local)

1) Create and activate venv (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

2) Start backend (uses `backend` as PYTHONPATH):

PowerShell:
```powershell
.\start-dev.ps1
```

Bash/Linux:
```bash
./start-dev.sh
```

(Alternatively run directly)
```powershell
$env:PYTHONPATH = Join-Path (Get-Location).Path 'backend'
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

3) Health check:
```powershell
curl -i http://127.0.0.1:8001/health
```

4) Run tests (from repo root):
```powershell
.\.venv\Scripts\python.exe -m pytest -q backend\tests
```

5) Quick POST test (example):
```powershell
.\.venv\Scripts\python.exe backend\scripts\local_test_post2.py
```

Notes:
- Copy `backend\.env.example` to `backend\.env` and update values if needed.
- I did not commit changes automatically; you can review and commit when ready.
