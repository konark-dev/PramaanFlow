# Antigravity Workspace Rules for Udyog Setu

## Workspace Objectives
- This workspace contains the full-stack **Udyog Setu (SIH 2026 PS 26130)** application (Next.js 14 frontend and Express TypeScript backend).

## Automated Setup & Build Execution
- Always use `npm start` or `./start.sh` to launch both backend (:4000) and frontend (:3000) simultaneously with automatic browser opening.
- If dependencies or environment files are missing, run `npm run setup` (or `node scripts/setup.js`).
- To run tests: `npm test` or `npm run test:unit`.
- Backend entry point: `backend/src/index.ts`.
- Frontend entry point: `frontend/src/app/page.tsx`.

## Coding Style & Rules
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, TanStack Query, React Flow, Lucide icons.
- Backend: Express, Node.js, TypeScript, Supabase client with fallback credentials.
- Always preserve declarative JSON rule structures and role-based access control (RBAC) across Applicant, Officer, Nodal, Inspector, and Admin personas.
