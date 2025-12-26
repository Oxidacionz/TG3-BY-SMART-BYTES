#!/usr/bin/env bash
export PYTHONPATH="$(pwd)/backend"
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
