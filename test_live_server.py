import httpx
import json
import sys

BASE = 'http://localhost:8000'

print('======================================================')
print('RUNNING LIVE END-TO-END VERIFICATION ON ' + BASE)
print('======================================================\n')

client = httpx.Client(base_url=BASE, timeout=10.0)

# 1. Health
print('[TEST 1] System Health & Hindsight Status')
r = client.get('/api/health')
assert r.status_code == 200, f'Status {r.status_code}'
data = r.json()
print(f' -> Status: {data.get("status")}')
print(f' -> Memory Provider: {data.get("memory_provider_label")}')
print(f' -> Hindsight URL: {data.get("hindsight_base_url")}\n')

# 2. Customers
print('[TEST 2] Customer Registry & Scopes')
r = client.get('/api/customers')
assert r.status_code == 200
customers = r.json()
print(f' -> Total Customers: {len(customers)}')
for c in customers:
    print(f'    - {c["name"]} | API: {c["api_name"]} ({c["api_version"]}) | Auth: {c["auth_type"]}')
print()

# 3. Flow 1A: Apex Retail 401
print('[TEST 3] Flow 1A: Known Issue - Apex Retail (401 Webhook Key ID Mismatch)')
payload_1a = {
    'customer_id': 'cust_apex_retail',
    'api_name': 'Orders & Webhooks Sync API',
    'api_version': 'v2.4',
    'symptoms': '401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.',
    'error_message': 'invalid_token: Token signature validation failed: kid does not match active JWKS key',
    'steps_tried': 'Verified client secret in developer portal, tested token endpoint manually via curl (200 OK).'
}
r = client.post('/api/issues/analyze', json=payload_1a)
assert r.status_code == 200
res_1a = r.json()
assert res_1a['status'] == 'match_found'
assert res_1a['match']['case_id'] == 'CASE-1082'
print(f' -> Result Status: {res_1a["status"]} (Needs Investigation: {res_1a["needs_investigation"]})')
print(f' -> Memory Bank: {res_1a["memory_scope"]}')
print(f' -> Recalled Case: {res_1a["match"]["case_id"]} - {res_1a["match"]["title"]}')
print(f' -> Verified Fix: {res_1a["match"]["verified_fix"][:80]}...')
print(f' -> Relevance Score: {res_1a["match"]["relevance_score"]}\n')

# 4. Flow 1B: Beacon Financial 401 (Same symptom, different fix, customer isolation)
print('[TEST 4] Flow 1B: Customer Memory Isolation - Beacon Financial (Same 401 Symptom -> mTLS CA Fix)')
payload_1b = {
    'customer_id': 'cust_beacon_fin',
    'api_name': 'Orders & Webhooks Sync API',
    'api_version': 'v1.9 (Enterprise Legacy)',
    'symptoms': '401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.',
    'error_message': 'invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted',
    'steps_tried': 'Regenerated client API secret, verified client public IP in firewall whitelist.'
}
r = client.post('/api/issues/analyze', json=payload_1b)
assert r.status_code == 200
res_1b = r.json()
assert res_1b['status'] == 'match_found'
assert res_1b['match']['case_id'] == 'CASE-1094'
print(f' -> Result Status: {res_1b["status"]}')
print(f' -> Memory Bank: {res_1b["memory_scope"]}')
print(f' -> Recalled Case: {res_1b["match"]["case_id"]} - {res_1b["match"]["title"]}')
print(f' -> Verified Fix: {res_1b["match"]["verified_fix"][:80]}...')
print(' -> ISOLATION CHECK: Apex Retail OAuth fix was NOT returned for Beacon Financial. PASS!\n')

# 5. Flow 2: Catalyst Health 504 (Needs Investigation)
print('[TEST 5] Flow 2: Novel Issue - Catalyst Health (504 Timeout -> Needs Investigation)')
payload_2 = {
    'customer_id': 'cust_catalyst_health',
    'api_name': 'Clinical Records & Telehealth API',
    'api_version': 'v3.0',
    'symptoms': '504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).',
    'error_message': 'gateway_timeout: Downstream worker timed out after 30000ms',
    'steps_tried': 'Checked worker thread count, increased request timeout from 30s to 60s.'
}
r = client.post('/api/issues/analyze', json=payload_2)
assert r.status_code == 200
res_2 = r.json()
assert res_2['status'] == 'needs_investigation'
assert res_2['needs_investigation'] is True
assert res_2['match'] is None
print(f' -> Result Status: {res_2["status"]}')
print(f' -> Needs Investigation Flag: {res_2["needs_investigation"]}')
print(f' -> Match Object: {res_2["match"]} (Zero hallucination verified)')
print(f' -> Suggested Action: {res_2["suggested_action"]}\n')

# 6. Flow 3A: Retain Confirmed Resolution
print('[TEST 6] Flow 3A: Retain Human-Verified Resolution into Hindsight Memory')
res_payload = {
    'customer_id': 'cust_catalyst_health',
    'api_name': 'Clinical Records & Telehealth API',
    'api_version': 'v3.0',
    'symptoms': '504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).',
    'error_message': 'gateway_timeout: Downstream worker timed out after 30000ms',
    'steps_tried': 'Checked worker thread count, increased request timeout from 30s to 60s.',
    'root_cause': 'Database read replica lag exceeded 180s due to unindexed compound query on export_status + organization_id.',
    'verified_fix': 'Added compound B-tree index on (organization_id, export_status, created_at) and set query MAX_EXECUTION_TIME = 15000.',
    'verified_by': 'Elena Rostova (Senior Integration Specialist)',
    'case_id': 'CASE-1105',
    'title': 'Batch Export 504: Database Read Replica Lag & Missing Compound Index'
}
r = client.post('/api/issues/CASE-1105/resolution', json=res_payload)
assert r.status_code == 200
ret_res = r.json()
assert ret_res['success'] is True
print(f' -> Retention Success: {ret_res["success"]}')
print(f' -> Case ID: {ret_res["case_id"]}')
print(f' -> Memory Bank: {ret_res["memory_scope"]}')
print(f' -> Message: {ret_res["message"]}\n')

# 7. Flow 3B: Re-analyze Catalyst Health 504 (Memory Learned!)
print('[TEST 7] Flow 3B: Re-analyze Issue to Verify Persistent Memory Learning')
r = client.post('/api/issues/analyze', json=payload_2)
assert r.status_code == 200
res_3b = r.json()
assert res_3b['status'] == 'match_found'
assert res_3b['needs_investigation'] is False
assert res_3b['match']['case_id'] == 'CASE-1105'
print(f' -> Result Status: {res_3b["status"]}')
print(f' -> Recalled Newly Learned Case: {res_3b["match"]["case_id"]} - {res_3b["match"]["title"]}')
print(f' -> Verified Fix Proposal: {res_3b["match"]["verified_fix"]}')
print(f' -> Relevance Score: {res_3b["match"]["relevance_score"]}')
print(' -> LEARNING LOOP VERIFIED: Previous novel issue is now permanently remembered! PASS!\n')

# 8. Frequent Problems
print('[TEST 8] Frequent Problems & Analytics')
r = client.get('/api/problems')
assert r.status_code == 200
problems = r.json()
print(f' -> Total Frequent Problems: {len(problems)}')
for p in problems[:3]:
    print(f'    - {p["title"]} ({p["occurrences"]} incidents, severity: {p["severity"]})')
print()

# 9. Verified Fixes Catalog
print('[TEST 9] Verified Fixes Catalog')
r = client.get('/api/verified-fixes')
assert r.status_code == 200
fixes = r.json()
print(f' -> Total Cataloged Fixes: {len(fixes)}')
print(f' -> Latest Added: {fixes[0]["case_id"]} - {fixes[0]["title"]} (Outcome: {fixes[0]["outcome"]})\n')

# 10. Dashboard Telemetry
print('[TEST 10] Dashboard Telemetry')
r = client.get('/api/dashboard')
assert r.status_code == 200
dash = r.json()
print(f' -> Recall Hit Rate: {dash["memory_recall_hit_rate"]}')
print(f' -> Total Verified Fixes in Memory: {dash["total_verified_fixes"]}')
print(f' -> Active Customer Scopes: {dash["active_customer_scopes"]}')
print(f' -> Time Saved: {dash["avg_investigation_time_saved"]}\n')

# 11. Frontend Static Assets
print('[TEST 11] Frontend HTML & Asset Delivery')
r_html = client.get('/')
assert r_html.status_code == 200
assert 'API CaseTracker' in r_html.text
print(f' -> Index HTML served with code {r_html.status_code} ({len(r_html.text)} bytes)')

print('\n======================================================')
print('ALL 11 LIVE VERIFICATION TESTS PASSED 100% SUCCESSFULLY!')
print('======================================================')
