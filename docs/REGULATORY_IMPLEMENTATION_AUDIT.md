# Regulatory Implementation Audit

## 1. Existing Frontend Structure
- Built with **Next.js 15** (App Router).
- Located in `frontend/src/app` and `frontend/src/components`.
- Uses `Vercel AI SDK` (`ai` package) for AI chat interactions (`frontend/src/app/api/chat`).
- Completely stateless/mocked current regulatory analysis (`frontend/src/lib/project-state.ts` creates mock `approvals` and `metrics`).

## 2. Existing Backend Structure
- Integrated within Next.js API routes (`frontend/src/app/api`).
- Current API routes include `/api/applicant/analyze`, `/api/geospatial/analyze`, `/api/chat`.
- No separate FastAPI backend found despite mentions in `tech-stack.md` (P0 Phase 1).

## 3. Existing Database Setup & Schema
- PostgreSQL + PostGIS initialized via Docker (`docker/init-db/01-init.sql`).
- Existing `project_sites` table:
  - `id` (UUID)
  - `project_name`
  - `sector`
  - `proposed_investment_inr`
  - `latitude`, `longitude`, `geom` (PostGIS point)
- Existing `industrial_zones` and `environmental_buffers` tables for geospatial intelligence.
- No `pgvector` setup or tables yet.
- Drizzle / Prisma ORM is **absent** from `package.json`. Data access must be currently missing or mocked in the frontend API.

## 4. Current AI Flow & Gemini Integration
- Vercel AI SDK `@ai-sdk/google` is installed.
- Chat routes handle AI interactions.
- Tool-calling infrastructure is likely stubbed or using AI SDK's `tool` definitions in `app/api/chat/route.ts` or `lib/applicant-tools`.

## 5. Existing Infrastructure
- **Docker Compose** orchestrates `web`, `postgis`, `vroom`, `redis`, and `neo4j`.
- Neo4j is present (port 7474/7687, credentials `neo4j/regulatoryos123`).
- PostGIS is present on port 5432 (`postgres`/`postgrespassword`, db `regulatory_os`).
- Temporal, OPA, and Docling are **not yet implemented** or running in the current docker stack.

## 6. What is Missing
- Regulatory Knowledge Graph schema in Neo4j (empty currently).
- PostgreSQL tables for regulatory data (`approvals`, `rules`, `departments`, `documents`).
- The actual Sync mechanism from `project_sites` to Neo4j.
- The Approval Recommendation Engine (deterministic logic).
- OPA rules and execution engine.
- Provenance/Evidence system.

## 7. Plan of Action (Files to Create/Change)
1. **Mapping:** Create `/docs/PROJECT_TO_REGULATORY_MAPPING.md`.
2. **Schema Migration:** Add `03-regulatory.sql` in `docker/init-db/` to initialize regulatory tables in Postgres.
3. **Module Structure:** Create `frontend/src/lib/ai/regulatory/` directory.
4. **Data Models:** Define types in `types.ts`.
5. **Ingestion & Seed:** Create seed data and ingestion logic in `data/seed.json` and `ingestion/`.
6. **Graph Sync:** Add Neo4j client and `syncProjectToRegulatoryGraph` logic in `graph/`.
7. **Recommendation Engine:** Implement `recommendation-engine.ts`.
8. **OPA Integration:** Stub or implement local deterministic validation in `rules/`.
9. **API Routes:** Add `/api/regulatory/sync` and `/api/regulatory/recommendations` etc.
10. **AI Tools:** Add `get_required_approvals` and `get_regulatory_evidence` to existing AI tools.
