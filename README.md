# API CaseTracker — Support That Remembers Every API Fix

> **Hack with Bangalore 4.0 Hackathon Submission**  
> 🌐 **Live Production URL:** [https://api-casetracker.vercel.app](https://api-casetracker.vercel.app)  
> 📝 **Published Technical Article:** [Read on Dev.to](https://dev.to/mohinth_ps_20d0c25911150b/api-casetracker-eliminating-api-support-rediscovery-with-customer-partitioned-persistent-memory-2lnb)  
> Persistent Memory Layer: **Hindsight by Vectorize** (`hindsight-client`)  
> Full-Stack Architecture: **FastAPI (Python) + React & TypeScript (Vite)**  
> UI/UX System: **Editorial Engineering Atelier** (based on Figma specification)

---

## 1. Project Purpose & Problem Statement

Enterprise support engineers frequently troubleshoot customer-specific API integration problems. Different customers operate on different API versions, divergent authentication protocols (OAuth 2.0 PKCE vs. Mutual TLS vs. SAML/OIDC), proxy setups, and key rotation schedules.

When an integration issue repeats, support staff often have to rediscover what happened and which fixes worked—wasting hours per incident. 

**API CaseTracker** solves this by maintaining a **persistent memory layer** powered by **Hindsight**. It remembers each customer's:
1. Architectural setup & API versions
2. Historical failure symptoms & stack traces
3. Attempted troubleshooting steps
4. Confirmed root causes
5. **Human-verified fixes**

### Core Principles
- **Strict Customer Isolation:** Each customer's memories are strictly partitioned into a dedicated Hindsight memory bank (`casetracker-{customer_id}`). Memories, certificates, and tokens never leak between customer scopes.
- **Zero-Hallucination Protocol:** If no reliable verified case is found in Hindsight memory, the system explicitly reports **"Needs investigation"**. It will **never invent** a speculative diagnosis or phantom remedy.
- **Continuous Learning Loop:** Once a human engineer investigates and confirms the root cause and resolution, it is retained into Hindsight to prevent future rediscovery.

---

## 2. Interactive Hackathon Demo Flows

The project is pre-seeded with fictional demo customers and provides 1-click preset buttons in the UI as well as an automated Postman collection to demonstrate the 3 required flows:

### Flow 1A: Known Issue With Prior Fix (Apex Retail Group)
- **Customer:** Apex Retail Group (`cust_apex_retail`)
- **API & Auth:** Orders & Webhooks Sync API v2.4 (OAuth 2.0 PKCE with dynamic JWKS key rotation)
- **Symptom:** `401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe)`
- **Error:** `invalid_token: Token signature validation failed: kid does not match active JWKS key`
- **Hindsight Recall Result:** Recalls **`CASE-1082`**.
- **Verified Fix:** Flush Redis OAuth token cache on the webhook proxy and set `jwks_poll_interval_seconds` to 300 to match key rotation schedule.

### Flow 1B: Customer Memory Isolation Proof (Beacon Financial Systems)
- **Customer:** Beacon Financial Systems (`cust_beacon_fin`)
- **API & Auth:** Orders & Webhooks Sync API v1.9 Enterprise Legacy (Mutual TLS / mTLS)
- **Symptom:** **Exact same visible symptom as Flow 1A:** `401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe)`
- **Error:** `invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted`
- **Hindsight Recall Result:** Customer-isolated memory recall returns **`CASE-1094`** (DigiCert Enterprise Intermediate CA expired in client edge truststore).
- **Demo Impact:** Demonstrates that the exact same symptom yields customer-specific fixes without cross-tenant memory leakage.

### Flow 2: Novel Issue Requiring Human Investigation (Catalyst Health Cloud)
- **Customer:** Catalyst Health Cloud (`cust_catalyst_health`)
- **API & Auth:** Clinical Records & Telehealth API v3.0 (OIDC + JWE Payload Encryption)
- **Symptom:** `504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch)`
- **Error:** `gateway_timeout: Downstream worker timed out after 30000ms`
- **Hindsight Recall Result:** **`Needs investigation`**. Zero hallucinations. The engineer is prompted to perform manual diagnostics.

### Flow 3: Learning Loop (Retain Resolution & Instant Recall)
- **Action:** Support engineer confirms root cause (database read replica query lag > 180s) and verified fix (added compound B-tree index on `(organization_id, export_status, created_at)`).
- **Retention:** Case **`CASE-1105`** is retained into Hindsight memory bank `casetracker-cust-catalyst-health`.
- **Recall Verification:** Re-analyzing the exact same 504 issue now immediately recalls **`CASE-1105`** with the verified compound index fix, demonstrating real-time memory learning!

---

## 3. Technology Stack & Design System

- **Backend:** Python 3.10+ / 3.14, FastAPI, Uvicorn, Pydantic v2, `hindsight-client`
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Design System:** **Editorial Engineering Atelier** (based on Figma specification)
  - Broadhseet canvas (`#FAF8F5`, `#F4EFEA`, `#FFFFFF`)
  - Deep Forest Green (`#07241A`, `#1E3A2F`)
  - Muted Sage (`#5E7D6D`, `#C6E8D4`)
  - Burnt Orange (`#C85A32`, `#FDF1EA`)
  - Typography: **Newsreader** (editorial serif headlines), **Plus Jakarta Sans** (clean interface), and **JetBrains Mono** (API telemetry)
  - 4px tailored corner radius (no glowing effects, purple gradients, or circular bubbles)

---

## 4. Website Pages & Screens

1. **Home (`/`):** "Support that remembers every API fix." Broadsheet value proposition, memory isolation architecture schematic, and 1-click links to the 3 demo flows.
2. **Dashboard:** High-level figures (88.6% recall hit rate, 4.2 hrs saved per incident), monthly recall vs. resolution time trend chart, and recent case list.
3. **Troubleshooting:** Issue submission form, customer memory bank selector, 1-click demo presets, **Match Found** review card, and **Needs Investigation** state with resolution retention form.
4. **Frequent Problems:** Ranked horizontal bar chart of top recurring integration failure clusters, category filters, and detailed diagnostic runbook panel.
5. **Customer API Profiles:** Customer registry, API versions, authentication summaries, configuration parameters table, and incident timelines.
6. **Verified Fixes:** Searchable, filterable post-mortem catalog with full forensic modal drawers.

---

## 5. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies (including official hindsight-client)
python -m pip install -r requirements.txt

# Configure environment variables (optional for live Hindsight)
cp .env.example .env
```

### 2. Environment Variables (`backend/.env`)
```ini
# Hindsight Persistent Memory Configuration
# If credentials are not provided, API CaseTracker runs in Demo Memory Mode (fictional seed store)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=

# Server Configuration
HOST=0.0.0.0
PORT=8000
```
> [!NOTE]
> **Hindsight Cloud Credits:** You can use promo code **`MEMHACK99`** to get **$50 free credits** on [ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io).  
> If `HINDSIGHT_API_KEY` is omitted, the app automatically runs in **Demo Memory Mode**, clearly labeled across the UI and API responses, while preserving identical customer-isolated memory semantics.

### 3. Run the Application

#### Option A: Unified Full-Stack Server (Recommended)
The production frontend build is pre-compiled inside `frontend/dist` and directly served by FastAPI on port 8000:
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Open **`http://localhost:8000`** in your browser.

#### Option B: Independent Vite Dev Server
```bash
# Terminal 1 - Backend API:
cd backend
python -m uvicorn app.main:app --port 8000 --reload

# Terminal 2 - Frontend Hot Reload:
cd frontend
npm.cmd run dev
```
Open **`http://localhost:5173`** (Vite proxies all `/api` requests to port 8000).

---

## 6. Automated Flow Verification & Tests

Run the built-in automated test suite covering all 5 core memory flows:
```bash
cd backend
python tests/test_flows.py
```

Expected output:
```
[PASS] Health endpoint ok: Demo Memory Mode (Fictional Seed Store)
[PASS] Customers list ok: ['Apex Retail Group [Demo Data]', 'Beacon Financial Systems [Demo Data]', 'Catalyst Health Cloud [Demo Data]']
[PASS] Flow 1A - Apex Retail returned CASE-1082 (OAuth token cache)
[PASS] Flow 1B - Beacon Financial returned CASE-1094 (mTLS Intermediate CA) - Memory Isolation verified!
[PASS] Flow 2 - Unmatched issue returned 'needs_investigation' without hallucinating a fix!
[PASS] Flow 3A - Human-verified resolution retained into memory bank: casetracker-cust-catalyst-health
[PASS] Flow 3B - Learned resolution successfully recalled! Memory improvement demonstrated.

ALL 5 CORE VERIFICATION SUITES PASSED PERFECTLY!
```

---

## 7. Postman Collection Walkthrough

Import the collection file located at:  
📁 `postman/API_CaseTracker_Hindsight.postman_collection.json`

### Executing the Collection
1. **0. System Health & Memory Provider:** `GET http://localhost:8000/api/health`
2. **1. Customer Profiles & Memory Scopes:** `GET http://localhost:8000/api/customers`
3. **Flow 1A: Known Issue - Apex Retail:** `POST /api/issues/analyze`  
   *Recalls CASE-1082 (Redis OAuth token cache flush).*
4. **Flow 1B: Customer Isolation - Beacon Financial:** `POST /api/issues/analyze`  
   *Same 401 symptom recalls CASE-1094 (mTLS Intermediate CA), proving customer memory isolation.*
5. **Flow 2: Unmatched Issue - Catalyst Health:** `POST /api/issues/analyze`  
   *Returns `needs_investigation: true` with zero hallucinated remedies.*
6. **Flow 3A: Retain Confirmed Resolution:** `POST /api/issues/CASE-1105/resolution`  
   *Retains human-verified compound B-tree index fix into customer bank.*
7. **Flow 3B: Recall Newly Learned Fix:** `POST /api/issues/analyze`  
   *Re-submitting the exact same 504 query now immediately recalls CASE-1105!*
8. **Frequent Problems & Analytics:** `GET /api/problems`
9. **Verified Fixes Catalog:** `GET /api/verified-fixes`
10. **Dashboard Telemetry:** `GET /api/dashboard`

---

## 8. Hindsight Integration Details

Hindsight's Python SDK is initialized in `backend/app/hindsight_service.py`:

```python
from hindsight_client import Hindsight

# Initialized via environment variables
client = Hindsight(
    base_url=settings.HINDSIGHT_BASE_URL,
    api_key=settings.HINDSIGHT_API_KEY,
    timeout=15.0
)

# 1. Scoped Recall
response = client.recall(
    bank_id=f"casetracker-{customer_id}",
    query=search_query,
    max_tokens=2048,
    budget="mid"
)

# 2. Scoped Retention
client.retain(
    bank_id=f"casetracker-{customer_id}",
    content=formatted_memory_document,
    document_id=case_id,
    metadata={
        "case_id": case_id,
        "customer_id": customer_id,
        "root_cause": root_cause,
        "verified_fix": verified_fix,
        "verified_by": verified_by
    },
    tags=["verified_fix", f"cust_{customer_id}"]
)
```

---

## 9. Submission Summary

- **Live Prototype:** Complete and functional.
- **Persistent Memory:** Scoped per customer with official `hindsight-client`.
- **Anti-Hallucination:** Strictly enforced via `needs_investigation` state.
- **Crafted UX:** Built following the Editorial Engineering Atelier design system from the Figma prototype.
- **Demonstrations:** Ready via web UI preset buttons, automated Python test script, and Postman collection.
