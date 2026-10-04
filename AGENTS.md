# Udyog Setu — AGENTS.md

> Instructions and architectural guidelines for AI agents (including Google Antigravity) working in this workspace.

---

## 1. Project Overview & Context

- **Platform Name:** Udyog Setu (Industrial Approval & Compliance Intelligence Platform)
- **Problem Statement:** SIH 2026 · Problem Statement 26130 · Government of Maharashtra
- **Framework & Statutes:** MAITRI Act 2023 & MAITRI Rules 2025 (Maharashtra Industry, Trade and Investment Facilitation)
- **Core Purpose:** End-to-end industrial approval single-window system orchestrating applications across regulatory bodies (MIDC, MPCB, Fire Services, DISH, Labour, Electricity, FSSAI).

---

## 2. Zero-Config Startup & Build Commands

When an agent or developer opens this repository, all required services can be set up and started with a single command:

```bash
# Complete setup and launch (creates .env, installs dependencies, starts backend & frontend, opens browser):
npm start
# or on Linux/macOS:
./start.sh
```

### Manual Individual Commands:
- **Environment & Dependency Setup:** `node scripts/setup.js` or `npm run setup`
- **Run Backend only (Port 4000):** `npm run dev:backend`
- **Run Frontend only (Port 3000):** `npm run dev:frontend`
- **Build Full Project:** `npm run build`
- **Run All Tests (45 suites, 220+ tests):** `npm test`
- **Run Unit Tests:** `npm run test:unit`
- **Run Integration Tests:** `npm run test:integration`

---

## 3. Technology Stack & Key Directories

| Component | Path | Technology |
|---|---|---|
| **Frontend** | `/frontend` | Next.js 14 (App Router), TypeScript, Tailwind CSS, `@tanstack/react-query`, `reactflow`, `recharts`, `lucide-react` |
| **Backend** | `/backend` | Node.js, Express, TypeScript, `@supabase/supabase-js`, `@supabase/server`, `pdf-parse` |
| **Database** | Supabase PostgreSQL | Cloud Supabase instance with fallback credentials in `backend/src/lib/supabase.ts` |
| **Startup Scripts** | `/scripts` | Cross-platform Node.js automation (`setup.js`, `start.js`) |

---

## 4. Key Routes & User Portals

### Applicant / Investor Portal (`/app/*`)
- `/app/dashboard`: Project Control Centre (Readiness %, Active Blockers, Next-Best-Action deep links)
- `/app/projects/new`: Know Your Approvals (KYA) 5-step onboarding wizard
- `/app/projects/[id]/profile`: Master Business Dossier & Common Application Form (CAF)
- `/app/approvals`: Approval Roadmap (React Flow dependency DAG)
- `/app/documents`: Statutory Document Vault with verification badges and cross-department reuse

### Government Authority Portal (`/government/*`)
- `/government/work-queue`: Competent Authority scrutiny queue with risk priority scoring
- `/government/sla-monitor`: Specified Time Limit (RTS) countdown monitor & deemed approval warnings
- `/government/inspections`: Joint Department Inspection Planner with geo-tagged reports
- `/government/bottlenecks`: Delay origin attribution analytics

### Governance & Admin Portal (`/admin/*`)
- `/admin/approval-types`: Regulatory catalog management
- `/admin/rules`: Declarative JSON rule definitions for dynamic approval applicability
- `/admin/sla-policies`: Service-Level Agreement policies and statutory limits

---

## 5. Demo Accounts & Personas (Password: `Demo@123`)

- **Applicant / Investor:** `entrepreneur@demo.local` (Rajesh Mehta · ABC Foods Pvt Ltd)
- **Authorized Representative:** `manager@demo.local` (Amit Deshmukh)
- **Competent Officer (MIDC):** `officer@demo.local` (Sunil Patil)
- **Competent Officer (MPCB):** `pcb.officer@demo.local` (Dr. Vivek Sharma)
- **MAITRI Nodal Officer:** `nodal@demo.local` (Anjali Rane)
- **Joint Site Inspector:** `inspector@demo.local` (Kavita Joshi)
- **System Administrator:** `admin@demo.local`

---

## 6. Coding & Modification Guidelines for Agents

1. **Rule Engine & Approvals:**
   - Any modifications to statutory approval logic should update declarative JSON definitions in `backend/src/rule-engine/` and mirror corresponding UI checks in `frontend/src/lib/guidanceEngine.ts`.
2. **Environment Variables:**
   - Always ensure defaults exist in code so the system boots seamlessly without requiring manual env secrets in demo mode.
3. **Frontend Component Architecture:**
   - Use Tailwind CSS and existing design tokens.
   - For interactive charts, utilize `recharts`.
   - For dependency graphs, utilize `reactflow`.
