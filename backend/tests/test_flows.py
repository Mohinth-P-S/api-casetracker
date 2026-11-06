import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "memory_provider" in data
    print("[PASS] Health endpoint ok:", data["memory_provider_label"])

def test_customers_isolation():
    res = client.get("/api/customers")
    assert res.status_code == 200
    customers = res.json()
    assert len(customers) >= 3
    ids = [c["id"] for c in customers]
    assert "cust_apex_retail" in ids
    assert "cust_beacon_fin" in ids
    assert "cust_catalyst_health" in ids
    print("[PASS] Customers list ok:", [c["name"] for c in customers])

def test_flow_1_known_issue_with_prior_fix():
    # Customer A: Apex Retail (OAuth 2.0 PKCE)
    payload_a = {
        "customer_id": "cust_apex_retail",
        "api_name": "Orders & Webhooks Sync API",
        "api_version": "v2.4",
        "symptoms": "401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.",
        "error_message": "invalid_token: Token signature validation failed: kid does not match active JWKS key",
        "steps_tried": "Verified client secret in developer portal, tested token endpoint manually via curl (200 OK)."
    }
    res_a = client.post("/api/issues/analyze", json=payload_a)
    assert res_a.status_code == 200
    data_a = res_a.json()
    assert data_a["status"] == "match_found"
    assert data_a["needs_investigation"] is False
    assert data_a["match"]["case_id"] == "CASE-1082"
    assert "Redis OAuth token cache" in data_a["match"]["verified_fix"]
    assert data_a["memory_scope"] == "casetracker-cust-apex-retail"
    print("[PASS] Flow 1A - Apex Retail returned CASE-1082 (OAuth token cache)")

    # Customer B: Beacon Financial (mTLS) - EXACT SAME VISIBLE SYMPTOM
    payload_b = {
        "customer_id": "cust_beacon_fin",
        "api_name": "Orders & Webhooks Sync API",
        "api_version": "v1.9 (Enterprise Legacy)",
        "symptoms": "401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.",
        "error_message": "invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted",
        "steps_tried": "Regenerated client API secret, verified client public IP in firewall whitelist."
    }
    res_b = client.post("/api/issues/analyze", json=payload_b)
    assert res_b.status_code == 200
    data_b = res_b.json()
    assert data_b["status"] == "match_found"
    assert data_b["needs_investigation"] is False
    assert data_b["match"]["case_id"] == "CASE-1094"
    assert "DigiCert Enterprise Intermediate CA" in data_b["match"]["verified_fix"]
    assert data_b["memory_scope"] == "casetracker-cust-beacon-fin"
    print("[PASS] Flow 1B - Beacon Financial returned CASE-1094 (mTLS Intermediate CA) - Memory Isolation verified!")

def test_flow_2_new_issue_needs_investigation():
    # Customer C: Catalyst Health (Unmatched 504 Timeout)
    payload_c = {
        "customer_id": "cust_catalyst_health",
        "api_name": "Clinical Records & Telehealth API",
        "api_version": "v3.0",
        "symptoms": "504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).",
        "error_message": "gateway_timeout: Downstream worker timed out after 30000ms",
        "steps_tried": "Checked worker thread count, increased request timeout from 30s to 60s, restarted client batch daemon."
    }
    res_c = client.post("/api/issues/analyze", json=payload_c)
    assert res_c.status_code == 200
    data_c = res_c.json()
    assert data_c["status"] == "needs_investigation"
    assert data_c["needs_investigation"] is True
    assert data_c["match"] is None
    print("[PASS] Flow 2 - Unmatched issue returned 'needs_investigation' without hallucinating a fix!")

def test_flow_3_save_resolution_and_recall_afterwards():
    # Retain the resolution for Catalyst Health's issue
    resolution_payload = {
        "customer_id": "cust_catalyst_health",
        "api_name": "Clinical Records & Telehealth API",
        "api_version": "v3.0",
        "symptoms": "504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).",
        "error_message": "gateway_timeout: Downstream worker timed out after 30000ms",
        "steps_tried": "Checked worker thread count, increased request timeout from 30s to 60s, restarted client batch daemon.",
        "root_cause": "Database read replica lag exceeded 180s due to unindexed compound query on export_status + organization_id, triggering upstream gateway timeout.",
        "verified_fix": "Added compound B-tree index on (organization_id, export_status, created_at) and set query MAX_EXECUTION_TIME = 15000.",
        "verified_by": "Elena Rostova (Senior Integration Specialist)",
        "case_id": "CASE-1105",
        "title": "Batch Export 504: Database Read Replica Lag & Missing Compound Index"
    }

    res_post = client.post("/api/issues/CASE-1105/resolution", json=resolution_payload)
    assert res_post.status_code == 200
    res_data = res_post.json()
    assert res_data["success"] is True
    assert res_data["case_id"] == "CASE-1105"
    print("[PASS] Flow 3A - Human-verified resolution retained into memory bank:", res_data["memory_scope"])

    # Now re-analyze the exact same issue: it should NOW be recalled from memory!
    analyze_payload = {
        "customer_id": "cust_catalyst_health",
        "api_name": "Clinical Records & Telehealth API",
        "api_version": "v3.0",
        "symptoms": "504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).",
        "error_message": "gateway_timeout: Downstream worker timed out after 30000ms",
        "steps_tried": "Checked worker thread count, increased request timeout from 30s to 60s."
    }
    res_reanalyze = client.post("/api/issues/analyze", json=analyze_payload)
    assert res_reanalyze.status_code == 200
    re_data = res_reanalyze.json()
    assert re_data["status"] == "match_found"
    assert re_data["needs_investigation"] is False
    assert re_data["match"]["case_id"] == "CASE-1105"
    assert "compound B-tree index" in re_data["match"]["verified_fix"]
    print("[PASS] Flow 3B - Learned resolution successfully recalled! Memory improvement demonstrated.")

if __name__ == "__main__":
    test_health()
    test_customers_isolation()
    test_flow_1_known_issue_with_prior_fix()
    test_flow_2_new_issue_needs_investigation()
    test_flow_3_save_resolution_and_recall_afterwards()
    print("\nALL 5 CORE VERIFICATION SUITES PASSED PERFECTLY!")
