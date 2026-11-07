# Title: How we eliminated enterprise API support déjà vu using customer-partitioned persistent memory (FastAPI + Hindsight)

Hey everyone!

I wanted to share an architecture and tool we built to solve one of the most frustrating, time-wasting problems in B2B enterprise software support: **rediscovering the exact same API integration fixes over and over again.**

### The Problem: Architectural Divergence
In modern B2B SaaS, no two enterprise customers run identical architectures:
* **Customer A** is on an older REST API `v2.1` with OAuth2 Bearer tokens and dynamic JWKS key rotation on AWS EU.
* **Customer B** runs an enterprise API `v1.9` over Mutual TLS (`mTLS`) with strict corporate truststores.
* **Customer C** runs a preview API `v3.0-rc` with HIPAA payload encryption envelopes.

When an incident occurs—say, an HTTP `401 Unauthorized` during a scheduled batch sync—an engineer might spend 4+ hours digging through proxy logs, token caches, and certificates before finding the root cause (e.g., a 5-minute token TTL cache drift). 

Three weeks later, the same customer makes the same mistake on a new microservice. A different engineer gets the ticket and spends *another 4 hours* rediscovering the exact same fix.

### Why Standard AI / Generic RAG Fails Here
1. **Cross-Tenant Data Leakage:** Dumping all tickets into a single vector database index risks querying Customer B's symptom and surfacing Customer A's private endpoint or internal token config.
2. **Architectural Mismatch:** A generic LLM will see "401 Unauthorized" and guess an OAuth token fix for a customer that actually uses mTLS client certificates, breaking production.
3. **Hallucinations:** When an LLM doesn't know the answer, it makes up plausible-sounding parameters.

---

### The Solution: API CaseTracker
We built **API CaseTracker** backed by **Hindsight** (by Vectorize) as an isolated, customer-partitioned persistent memory layer.

Here is how the architecture works:

1. **Strict Customer Memory Banks:**
Every customer is provisioned a cryptographically isolated memory bank: `casetracker-{customer_id}`.
When an incident is analyzed, queries *only* hit that customer's specific memory bank. Cross-tenant contamination is physically prevented.

2. **Zero-Hallucination Protocol:**
If an issue has never been diagnosed and verified before, the system has a strict confidence floor (>= 0.70). If no match is found, it explicitly returns `needs_investigation: true`. It will never guess or invent phantom parameters.

3. **The Continuous Learning Loop:**
When an unknown issue occurs, a human support engineer investigates and identifies the real fix. With one click, they submit the confirmed post-mortem into Hindsight via `client.retain()`. The fix is permanently committed to that customer's memory bank. Next time the issue occurs, it is recalled in under 120 milliseconds.

---

### Tech Stack
* **Backend:** Python / FastAPI, Uvicorn, Pydantic v2, `hindsight-client`
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (styled with an Editorial Atelier theme: ivory canvas, serif headlines, monospace telemetry)
* **Deployment:** Vercel Serverless Functions with unified path routing middleware for static assets

---

### Live Demo & Deep Dive
* 🌐 **Live Demo:** https://api-casetracker.vercel.app
* 📝 **Full Technical Article:** https://dev.to/mohinth_ps_20d0c25911150b/api-casetracker-eliminating-api-support-rediscovery-with-customer-partitioned-persistent-memory-2lnb

Would love to hear your thoughts on this architecture or how you handle tenant-specific incident memory in your own teams!
