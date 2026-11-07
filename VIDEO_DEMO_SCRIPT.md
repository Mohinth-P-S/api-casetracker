# API CaseTracker — 3-Minute Video Demo Script

> **Target Duration:** 2:45 to 3:00 minutes  
> **Recording Setup:** Record screen at [https://api-casetracker.vercel.app](https://api-casetracker.vercel.app) using Loom, OBS, or Zoom.

---

## ⏱️ Video Breakdown

| Time | Section | Screen Action | Voiceover / What to Say |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:30** | **The Hook & Problem** | Show Home Page ([api-casetracker.vercel.app](https://api-casetracker.vercel.app)) | *"In enterprise B2B software, no two customers run the same architecture. One customer runs REST v2.1 with OAuth2 tokens, another runs on Mutual TLS certificates, and a third runs HIPAA encrypted payloads. When an integration breaks, support engineers spend hours rediscovering the exact same fixes colleagues already solved weeks ago. Generic AI chatbots fail here because they treat every customer the same—recommending an OAuth token fix to an mTLS customer will crash production."* |
| **0:30 – 0:55** | **The Solution: Hindsight Memory** | Scroll down to the 3-step schematic on Home Page | *"We built **API CaseTracker**, backed by **Hindsight** by Vectorize as an isolated persistent memory layer. Every enterprise customer gets a dedicated, cryptographically partitioned memory bank (`casetracker-{customer_id}`). Today, I’m going to show you three live flows: Instant Recall, Customer Scope Isolation, and our Continuous Learning Loop."* |
| **0:55 – 1:30** | **Flow 1A: Instant Recall** | Click **Troubleshooting** &rarr; Click **Flow 1A: Apex Retail** | *"Let's look at Flow 1A with Apex Retail. They report an HTTP 401 Unauthorized during batch sync. When I click 'Run Hindsight Analysis', the system queries Apex Retail's isolated memory bank. In under 120 milliseconds, Hindsight recalls CASE-1082 with a 99% match score, pinpointing a token TTL drift and giving us the verified Redis cache flush command. No log digging, no rediscovery."* |
| **1:30 – 2:05** | **Flow 1B: Customer Isolation** | Click **Flow 1B: Beacon Financial** | *"Now here is the critical test: Customer Scope Isolation. Beacon Financial reports the EXACT SAME visible error: 401 Unauthorized during webhook registration. A generic LLM would confuse this with Apex's OAuth fix. But watch: Hindsight queries ONLY Beacon Financial's bank. Because Beacon runs on mTLS, it recalls CASE-1094—an expired intermediate CA in their edge truststore. Zero cross-tenant data leakage, 100% architectural fidelity."* |
| **2:05 – 2:40** | **Flow 2 & 3: The Learning Loop** | Click **Flow 2 & 3: Catalyst Health** &rarr; show form | *"What happens when a brand-new issue occurs? Catalyst Health reports an unknown 504 Gateway Timeout. Notice what our system does: it strictly refuses to hallucinate. It flags 'Needs Investigation' with a low confidence score. A human engineer diagnoses the database read-replica lag, enters the compound index fix, and clicks 'Confirm & Retain in Customer Hindsight Bank'. The fix is permanently learned! Next time this 504 appears, it resolves instantly."* |
| **2:40 – 3:00** | **Impact & Conclusion** | Click **Dashboard** tab (show 88.6% recall & 4.2 hrs saved) | *"By combining FastAPI, React, and Hindsight persistent memory, API CaseTracker cuts Mean Time to Resolution from 4.2 hours down to 120 milliseconds—a 99.2% reduction in support rediscovery time. The app is live in production on Vercel. Thank you!"* |

---

## 🎬 Tips for Recording Your Demo

1. **Browser Tab:** Have [https://api-casetracker.vercel.app](https://api-casetracker.vercel.app) opened in full screen (`F11` in Chrome to hide browser address bar for a super clean look).
2. **Audio:** Speak clearly at a moderate, confident pace.
3. **Cursor:** Use your mouse to hover over the **99% Match Score** and the **Customer Isolation Scope Badge** (`casetracker-cust_apex_retail`) to draw the judges' attention to the technical proof.
