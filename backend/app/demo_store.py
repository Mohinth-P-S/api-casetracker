from typing import Dict, List, Optional
import datetime
from app.models import CustomerProfile, IncidentEvent, PastCaseMatch, FrequentProblem, VerifiedFix

# Seed Customers (All fictional, clearly labeled Demo Data)
DEMO_CUSTOMERS: Dict[str, CustomerProfile] = {
    "cust_apex_retail": CustomerProfile(
        id="cust_apex_retail",
        name="Apex Retail Group [Demo Data]",
        industry="Omnichannel Retail & Logistics",
        api_name="Orders & Webhooks Sync API",
        api_version="v2.4",
        auth_type="OAuth 2.0 PKCE",
        auth_summary="Bearer JWT signed via RS256 with 15-minute token TTL and dynamic JWKS key rotation",
        environment="Production US-East (Multi-tenant)",
        webhook_url="https://webhooks.apexretail-demo.internal/orders/v2",
        base_url="https://api.apexretail-demo.internal/v2.4",
        config_summary={
            "auth_protocol": "OAuth 2.0 with PKCE",
            "token_endpoint": "/oauth/v2/token",
            "jwks_rotation": "enabled (active kid: kid-2026-q1)",
            "mtls_enforced": False,
            "signature_algorithm": "RS256",
            "rate_limit_per_minute": 2400,
            "webhook_retries": 3,
            "webhook_signature_header": "X-Apex-Signature-256"
        },
        incident_timeline=[
            IncidentEvent(
                date="2026-09-14",
                case_id="CASE-1082",
                title="Webhook Registration 401 (OAuth Key ID mismatch)",
                severity="Critical",
                status="Resolved & Verified",
                summary="Client edge proxy passed cached superseded token after developer portal key rotation."
            ),
            IncidentEvent(
                date="2026-07-20",
                case_id="CASE-1044",
                title="Catalog Sync Throttled at 2400 RPM",
                severity="Medium",
                status="Resolved & Verified",
                summary="Batch job lacked backoff jitter; implemented exponential backoff."
            )
        ]
    ),
    "cust_beacon_fin": CustomerProfile(
        id="cust_beacon_fin",
        name="Beacon Financial Systems [Demo Data]",
        industry="FinTech & Real-Time Settlement",
        api_name="Orders & Webhooks Sync API",
        api_version="v1.9 (Enterprise Legacy)",
        auth_type="Mutual TLS (mTLS)",
        auth_summary="Mutual TLS with strict client X.509 certificate verification and static IP whitelisting",
        environment="Enterprise Dedicated EU-Central",
        webhook_url="https://callbacks.beaconfin-demo.internal/settlement",
        base_url="https://gateway.beaconfin-demo.internal/v1.9",
        config_summary={
            "auth_protocol": "Mutual TLS (mTLS)",
            "tls_version": "TLSv1.3 only",
            "cipher_suite": "ECDHE-RSA-AES256-GCM-SHA384",
            "mtls_enforced": True,
            "ca_bundle": "DigiCert Enterprise Intermediate CA 2026",
            "rate_limit_per_minute": 800,
            "ip_whitelist": ["198.51.100.44", "198.51.100.45"],
            "client_cert_serial": "4B:89:12:FA:7E:01"
        },
        incident_timeline=[
            IncidentEvent(
                date="2026-10-02",
                case_id="CASE-1094",
                title="Webhook Registration 401 (Expired Intermediate CA)",
                severity="Critical",
                status="Resolved & Verified",
                summary="Intermediate CA certificate in client edge proxy truststore expired, causing TLS reject."
            ),
            IncidentEvent(
                date="2026-05-11",
                case_id="CASE-1019",
                title="Cipher Suite Negotiation Failure after Gateway Upgrade",
                severity="High",
                status="Resolved & Verified",
                summary="Legacy cipher deprecated on upstream gateway; client updated cipher preference list."
            )
        ]
    ),
    "cust_catalyst_health": CustomerProfile(
        id="cust_catalyst_health",
        name="Catalyst Health Cloud [Demo Data]",
        industry="Healthcare & Clinical Informatics",
        api_name="Clinical Records & Telehealth API",
        api_version="v3.0",
        auth_type="OIDC + JWE Payload Encryption",
        auth_summary="OpenID Connect JWT assertions with HIPAA audit headers and payload-level JWE encryption",
        environment="HIPAA Compliant US-West Isolated",
        webhook_url="https://events.catalyst-demo.internal/fhir",
        base_url="https://health-api.catalyst-demo.internal/v3.0",
        config_summary={
            "auth_protocol": "OIDC + JWE Payload Encryption",
            "audit_logging": "HIPAA Level-4 Comprehensive",
            "payload_encryption": "RSA-OAEP-256 with A256GCM",
            "mtls_enforced": False,
            "rate_limit_per_minute": 1500,
            "fhir_conformance_profile": "R4-Strict"
        },
        incident_timeline=[
            IncidentEvent(
                date="2026-08-30",
                case_id="CASE-1065",
                title="FHIR Bundle JWE Decryption Failure",
                severity="High",
                status="Resolved & Verified",
                summary="Client updated private key without regenerating companion JWE recipient descriptor."
            )
        ]
    )
}

# Seed Verified Cases partitioned strictly by customer_id (isolated memory banks)
SEED_VERIFIED_CASES: Dict[str, List[PastCaseMatch]] = {
    "cust_apex_retail": [
        PastCaseMatch(
            case_id="CASE-1082",
            source_id="hindsight-doc-apex-1082",
            title="Webhook Registration 401: Superseded OAuth Key ID in Token Cache",
            customer_id="cust_apex_retail",
            customer_name="Apex Retail Group [Demo Data]",
            api_name="Orders & Webhooks Sync API",
            api_version="v2.4",
            symptoms="401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.",
            error_pattern="invalid_token: Token signature validation failed: kid does not match active JWKS key",
            root_cause="Client's edge webhook ingress gateway cached OAuth tokens for 60 minutes, bypassing the active 15-minute rotation window and submitting signatures signed under superseded key kid-2025-q4 instead of kid-2026-q1.",
            verified_fix="Flush the Redis OAuth token cache on the client webhook proxy and update the jwks_poll_interval_seconds to 300 to match the active key rotation schedule.",
            verified_by="Devon Reed (Principal Support Engineer)",
            verified_at="2026-09-14 14:22 UTC",
            why_it_applies="Directly addresses Apex Retail Group's OAuth 2.0 PKCE setup where token caching outlives the server-side JWKS key rotation schedule.",
            relevance_score=0.96
        ),
        PastCaseMatch(
            case_id="CASE-1044",
            source_id="hindsight-doc-apex-1044",
            title="Catalog Batch Sync 429: Bursty Polling Without Jitter",
            customer_id="cust_apex_retail",
            customer_name="Apex Retail Group [Demo Data]",
            api_name="Orders & Webhooks Sync API",
            api_version="v2.4",
            symptoms="HTTP 429 Too Many Requests during morning batch catalog ingestion.",
            error_pattern="rate_limit_exceeded: Exceeded 2400 requests per minute threshold",
            root_cause="Cron jobs across 8 client pods fired concurrently at the top of the minute with zero jitter.",
            verified_fix="Added randomized jitter (0-15s) to the batch dispatch scheduler and enabled HTTP 429 retry-after header handling.",
            verified_by="Devon Reed (Principal Support Engineer)",
            verified_at="2026-07-20 11:05 UTC",
            why_it_applies="Applies to Apex Retail's high-throughput batch ingestion pipeline.",
            relevance_score=0.72
        )
    ],
    "cust_beacon_fin": [
        PastCaseMatch(
            case_id="CASE-1094",
            source_id="hindsight-doc-beacon-1094",
            title="Webhook Registration 401: Expired Intermediate CA in mTLS Truststore",
            customer_id="cust_beacon_fin",
            customer_name="Beacon Financial Systems [Demo Data]",
            api_name="Orders & Webhooks Sync API",
            api_version="v1.9 (Enterprise Legacy)",
            symptoms="401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.",
            error_pattern="invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted",
            root_cause="Intermediate CA certificate in Beacon Financial's mTLS bundle expired on their edge reverse proxy, causing the TLS handshake to fail before client cert auth completed.",
            verified_fix="Import renewed DigiCert Enterprise Intermediate CA bundle (v2026) into Beacon Financial's edge gateway truststore and restart the Envoy listener.",
            verified_by="Sarah Lin (Lead Integration Architect)",
            verified_at="2026-10-02 09:15 UTC",
            why_it_applies="Addresses Beacon Financial's mTLS requirement where strict certificate chain validation rejected the stale intermediate cert.",
            relevance_score=0.95
        ),
        PastCaseMatch(
            case_id="CASE-1019",
            source_id="hindsight-doc-beacon-1019",
            title="Cipher Suite Negotiation Failure on Gateway Handshake",
            customer_id="cust_beacon_fin",
            customer_name="Beacon Financial Systems [Demo Data]",
            api_name="Orders & Webhooks Sync API",
            api_version="v1.9 (Enterprise Legacy)",
            symptoms="SSL/TLS alert handshake_failure (40) when establishing connection.",
            error_pattern="ssl_handshake_failure: No shared cipher suites between client and server",
            root_cause="Client's legacy JVM 8 runtime only offered TLS 1.2 CBC suites that were disabled in the hardened edge gateway.",
            verified_fix="Upgraded client keystore configuration to enforce TLSv1.3 with ECDHE-RSA-AES256-GCM-SHA384.",
            verified_by="Sarah Lin (Lead Integration Architect)",
            verified_at="2026-05-11 16:40 UTC",
            why_it_applies="Applies to Beacon Financial's dedicated banking network TLS policy.",
            relevance_score=0.70
        )
    ],
    "cust_catalyst_health": [
        PastCaseMatch(
            case_id="CASE-1065",
            source_id="hindsight-doc-catalyst-1065",
            title="FHIR Bundle JWE Decryption Failure",
            customer_id="cust_catalyst_health",
            customer_name="Catalyst Health Cloud [Demo Data]",
            api_name="Clinical Records & Telehealth API",
            api_version="v3.0",
            symptoms="400 Bad Request: Unable to decrypt JWE payload.",
            error_pattern="jwe_decryption_error: Key mismatch for recipient descriptor 0",
            root_cause="Client replaced private key during quarterly rotation without updating the registered recipient JWK descriptor.",
            verified_fix="Updated public JWK in Catalyst developer portal and refreshed key descriptor mapping.",
            verified_by="Elena Rostova (Senior Integration Specialist)",
            verified_at="2026-08-30 18:00 UTC",
            why_it_applies="Specific to Catalyst Health Cloud JWE payload encryption architecture.",
            relevance_score=0.88
        )
    ]
}

# Frequent Problems for the Analytics & Dashboard view
FREQUENT_PROBLEMS: List[FrequentProblem] = [
    FrequentProblem(
        id="prob_auth_mismatch",
        title="Authentication & Handshake Mismatches",
        category="Security / Auth",
        occurrences=42,
        affected_customers=["Apex Retail Group [Demo Data]", "Beacon Financial Systems [Demo Data]"],
        common_symptoms="401 Unauthorized on webhook registration or token exchange endpoints.",
        common_root_cause="Client proxy caching stale keys, expired intermediate CAs, or mismatched OAuth scopes.",
        recommended_fix="Verify customer auth model (OAuth PKCE vs mTLS) and flush client token cache or update truststore.",
        severity="Critical"
    ),
    FrequentProblem(
        id="prob_rate_limits",
        title="Bursty Batch Rate Limiting (429)",
        category="Traffic / Quota",
        occurrences=29,
        affected_customers=["Apex Retail Group [Demo Data]", "Catalyst Health Cloud [Demo Data]"],
        common_symptoms="429 Too Many Requests during morning sync runs.",
        common_root_cause="Concurrent cron workers firing simultaneously with zero jitter.",
        recommended_fix="Implement exponential backoff with randomized jitter (0-15s) and honour Retry-After header.",
        severity="High"
    ),
    FrequentProblem(
        id="prob_payload_schema",
        title="Payload Decryption & Schema Version Drift",
        category="Payload / Serialization",
        occurrences=18,
        affected_customers=["Catalyst Health Cloud [Demo Data]"],
        common_symptoms="400 Bad Request on encrypted FHIR bundles or payload deserialization errors.",
        common_root_cause="Client rotating private encryption keys without updating companion JWK descriptor.",
        recommended_fix="Synchronize public JWK in API developer portal before enabling encrypted traffic.",
        severity="High"
    ),
    FrequentProblem(
        id="prob_timeout_batch",
        title="Downstream Gateway Timeouts on Batch Export",
        category="Performance / Latency",
        occurrences=14,
        affected_customers=["Catalyst Health Cloud [Demo Data]"],
        common_symptoms="504 Gateway Timeout during multi-thousand record exports.",
        common_root_cause="Missing compound index on organization_id + status causing replica query lag > 30s.",
        recommended_fix="Add compound B-tree index and set strict MAX_EXECUTION_TIME query safeguard.",
        severity="Medium"
    ),
    FrequentProblem(
        id="prob_webhook_delivery",
        title="Webhook Delivery Failure (HMAC Signature Mismatch)",
        category="Integration / Events",
        occurrences=11,
        affected_customers=["Apex Retail Group [Demo Data]"],
        common_symptoms="Webhook delivery alerts, customer receiver logs signature rejection.",
        common_root_cause="Raw request body modified by customer reverse proxy (stripping whitespace) before HMAC verification.",
        recommended_fix="Compute HMAC-SHA256 signature against verbatim raw byte stream before JSON parsing.",
        severity="Medium"
    )
]

# Verified Fixes List
VERIFIED_FIXES_CATALOG: List[VerifiedFix] = [
    VerifiedFix(
        case_id="CASE-1082",
        customer_id="cust_apex_retail",
        customer_name="Apex Retail Group [Demo Data]",
        api_name="Orders & Webhooks Sync API",
        api_version="v2.4",
        title="Webhook Registration 401: Superseded OAuth Key ID in Token Cache",
        symptoms="401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe).",
        error_message="invalid_token: Token signature validation failed: kid does not match active JWKS key",
        root_cause="Client's edge webhook ingress gateway cached OAuth tokens for 60 minutes, passing superseded kid-2025-q4.",
        verified_fix="Flushed Redis OAuth token cache on client webhook proxy and synchronized JWKS poll interval.",
        verified_by="Devon Reed (Principal Support Engineer)",
        verified_at="2026-09-14 14:22 UTC",
        outcome="100% webhook registration success restored; zero auth errors over 30 days.",
        environment="Production US-East"
    ),
    VerifiedFix(
        case_id="CASE-1094",
        customer_id="cust_beacon_fin",
        customer_name="Beacon Financial Systems [Demo Data]",
        api_name="Orders & Webhooks Sync API",
        api_version="v1.9 (Enterprise Legacy)",
        title="Webhook Registration 401: Expired Intermediate CA in mTLS Truststore",
        symptoms="401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe).",
        error_message="invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted",
        root_cause="Intermediate CA certificate in Beacon Financial's mTLS bundle expired on their edge reverse proxy.",
        verified_fix="Imported renewed DigiCert Enterprise Intermediate CA bundle (v2026) and restarted Envoy listener.",
        verified_by="Sarah Lin (Lead Integration Architect)",
        verified_at="2026-10-02 09:15 UTC",
        outcome="Mutual TLS handshake restored instantly; all enterprise settlement webhooks functioning.",
        environment="Enterprise Dedicated EU-Central"
    ),
    VerifiedFix(
        case_id="CASE-1044",
        customer_id="cust_apex_retail",
        customer_name="Apex Retail Group [Demo Data]",
        api_name="Orders & Webhooks Sync API",
        api_version="v2.4",
        title="Catalog Batch Sync 429: Bursty Polling Without Jitter",
        symptoms="HTTP 429 Too Many Requests during morning batch catalog ingestion.",
        error_message="rate_limit_exceeded: Exceeded 2400 requests per minute threshold",
        root_cause="Cron jobs across 8 client pods fired concurrently at top of minute with zero jitter.",
        verified_fix="Added randomized jitter (0-15s) to batch dispatch scheduler and enabled HTTP 429 retry-after header.",
        verified_by="Devon Reed (Principal Support Engineer)",
        verified_at="2026-07-20 11:05 UTC",
        outcome="Peak load smoothed by 62%; zero 429 rate limit exceptions recorded.",
        environment="Production US-East"
    ),
    VerifiedFix(
        case_id="CASE-1065",
        customer_id="cust_catalyst_health",
        customer_name="Catalyst Health Cloud [Demo Data]",
        api_name="Clinical Records & Telehealth API",
        api_version="v3.0",
        title="FHIR Bundle JWE Decryption Failure",
        symptoms="400 Bad Request: Unable to decrypt JWE payload.",
        error_message="jwe_decryption_error: Key mismatch for recipient descriptor 0",
        root_cause="Client replaced private key during quarterly rotation without updating registered recipient JWK descriptor.",
        verified_fix="Updated public JWK in Catalyst developer portal and refreshed key descriptor mapping.",
        verified_by="Elena Rostova (Senior Integration Specialist)",
        verified_at="2026-08-30 18:00 UTC",
        outcome="Clinical payload decryption restored; compliance audit log verified.",
        environment="HIPAA Compliant US-West Isolated"
    )
]

class DynamicDemoMemoryBank:
    """
    Manages in-memory memory banks per customer scope when live Hindsight credentials
    are not set. Remembers any resolutions confirmed during the session!
    """
    def __init__(self):
        # customer_id -> list of PastCaseMatch
        self.banks: Dict[str, List[PastCaseMatch]] = {}
        # initialize with deep copy of seed cases
        for cid, cases in SEED_VERIFIED_CASES.items():
            self.banks[cid] = list(cases)
            
        self.verified_catalog = list(VERIFIED_FIXES_CATALOG)

    def recall(self, customer_id: str, query: str, error_message: str, symptoms: str) -> Optional[PastCaseMatch]:
        """
        Recall matches STRICTLY within the requested customer's memory bank.
        Never checks other customer banks!
        """
        customer_cases = self.banks.get(customer_id, [])
        query_lower = f"{query} {error_message} {symptoms}".lower()
        
        best_match: Optional[PastCaseMatch] = None
        highest_score = 0.0

        for case in customer_cases:
            # Semantic keyword overlap scoring simulating vector recall
            score = 0.0
            searchable_text = f"{case.title} {case.symptoms} {case.error_pattern} {case.root_cause}".lower()
            
            # Key technical terms
            if "kid" in query_lower and "kid" in searchable_text:
                score += 0.4
            if "mtls" in query_lower and "mtls" in searchable_text:
                score += 0.4
            if "certificate" in query_lower and "certificate" in searchable_text:
                score += 0.35
            if "token" in query_lower and "token" in searchable_text:
                score += 0.3
            if "timeout" in query_lower and "timeout" in searchable_text:
                score += 0.4
            if "export" in query_lower and "export" in searchable_text:
                score += 0.35
            if "401" in query_lower and "401" in searchable_text:
                score += 0.25
            if "webhook" in query_lower and "webhook" in searchable_text:
                score += 0.25
            if "replica" in query_lower and "replica" in searchable_text:
                score += 0.45
            if "index" in query_lower and "index" in searchable_text:
                score += 0.45

            # Word overlap bonus
            query_words = set([w for w in query_lower.split() if len(w) > 3])
            case_words = set([w for w in searchable_text.split() if len(w) > 3])
            overlap = len(query_words.intersection(case_words))
            score += min(overlap * 0.08, 0.4)

            # Cap at 0.99
            final_score = min(score, 0.99)
            if final_score > highest_score:
                highest_score = final_score
                best_match = case

        # Only return if confidence is high (reliable match). Otherwise return None -> Needs Investigation!
        if highest_score >= 0.65:
            # return a copy with the calculated relevance score
            matched_copy = best_match.model_copy()
            matched_copy.relevance_score = round(highest_score, 2)
            return matched_copy

        return None

    def retain(self, case: PastCaseMatch, verified_fix_entry: VerifiedFix):
        """
        Retain a confirmed resolution into the customer's isolated memory bank.
        """
        if case.customer_id not in self.banks:
            self.banks[case.customer_id] = []
        
        # Prepend to customer's bank so latest resolution is remembered first
        self.banks[case.customer_id].insert(0, case)
        # Also add to verified fixes catalog
        self.verified_catalog.insert(0, verified_fix_entry)
        
        # Add to customer incident timeline
        if case.customer_id in DEMO_CUSTOMERS:
            cust = DEMO_CUSTOMERS[case.customer_id]
            cust.incident_timeline.insert(0, IncidentEvent(
                date=datetime.datetime.utcnow().strftime("%Y-%m-%d"),
                case_id=case.case_id,
                title=case.title,
                severity="High",
                status="Resolved & Verified",
                summary=f"Resolved: {case.root_cause[:80]}..."
            ))

# Global singleton demo memory bank
demo_memory_bank = DynamicDemoMemoryBank()
