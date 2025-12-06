# ⚡ SmartBytes Core | ToroGroup Financial System

> **Advanced Financial Backend & Automated Auditing System**  
> _Powered by FastAPI, Supabase & Computer Vision_

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📖 Project Overview

**SmartBytes Core (TG3)** is the central nervous system for ToroGroup's financial operations. It replaces manual spreadsheet tracking with a robust, automated ledger system capable of reading payment receipts, synchronizing real-time exchange rates, and providing audit-grade financial data.

This repository (`TG3-BY-SMART-BYTES`) hosts the unified API and logic layer used by the web dashboard and future WhatsApp integrations.

---

## 🏗️ Architecture & Modules

### 1. 👁️ Intelligent Receipt Scanner (OCR)
Auto-auditing pipeline that processes payment screenshots (Transfers, PagoMóvil) to verify claims against bank data.
- **Engine:** Tesseract 5 + OpenCV Pre-processing.
- **Audit Logic:** Extracts Amount, Date, Reference ID, and matches fuzzily against expected formats.
- **Security:** "Shadow" audit logging (stores raw text + confidence scores).

### 2. 💱 Exchange Rate Oracle (Dual-Sync)
A fail-safe system that ensures all financial records are normalized to USD/VES in real-time.
- **Sources:**
  - 🏛️ **BCV (Central Bank):** Official government rates.
  - 💹 **Binance P2P:** Real-time market street rates (USDT).
- **Strategy:** "Fallback & Cache" mechanism. If live scraping fails, it serves the last validated rate from the database.

### 3. 📒 Smart Ledger (Supabase)
The single source of truth for all transactions.
- **Row-Level Security (RLS):** ensures data isolation between operators.
- **Real-time Subscriptions:** Web frontend updates instantly when a scraper pushes new rates.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.10+ (for local dev)
- Supabase Project Credentials

### 1. Installation
Clone the repository:
```bash
git clone https://github.com/Oxidacionz/TG3-BY-SMART-BYTES.git
cd TG3-BY-SMART-BYTES
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_service_role_key
SECRET_KEY=your_app_secret
```

### 3. Running with Docker (Recommended)
Launch the entire backend stack (API + OCR Service):
```bash
cd backend
docker-compose up --build
```
The API will be available at `http://localhost:8000`.

---

## 📂 Project Structure

```bash
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints (v1)
│   │   ├── core/         # Config & Database Logic
│   │   ├── services/     # OCR & Scraper Logic
│   │   └── schemas/      # Pydantic Models
│   ├── Dockerfile        # Multistage Optimized Build
│   └── main.py           # Entry Point
├── database/             # SQL Schemas & Migrations
└── frontend/             # (Optional) React Dashboard
```

---

## 🤝 Contributing

**Internal Use Only.** This project is proprietary software for ToroGroup/SmartBytes.
Deployments are managed via **Railway** (Production) and GitHub Actions.

---
*© 2025 SmartBytes Financial Solutions.*
