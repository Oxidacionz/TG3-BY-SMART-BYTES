$env:PYTHONPATH = Join-Path (Get-Location).Path 'backend'
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001
