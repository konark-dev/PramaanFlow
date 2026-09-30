# Phase 0: 3-Portal Architecture & Internal Mapping

This document serves as the implementation blueprint to connect the Applicant, CA/Consultant, and Government/Inspector portals under a single shared case architecture without redesigning the UI.

## Current State Assessment

1. **State Management**: Currently, state is fractured. `ApplicantDiscoveryFlow` saves to `localStorage` independently. `GovernmentCommand` uses static `BOTTLENECK_DATA`. `InspectorWorkspace` uses `INITIAL_INSPECTIONS`.
2. **Missing Portals**: The CA / Consultant Portal does not exist.
3. **Missing Integrations**:
   - Applicant ↔ CA Handshake
   - Real-time approval status sync between Government and Applicant
   - Live route optimization fetch (`POST /api/optimize-route`) in the Inspector workspace.

## Internal Mapping: Feature → Component → Action

| Feature | Existing API / Component | UI Entry Point | Missing Functionality (To Implement) |
| :--- | :--- | :--- | :--- |
| **Shared Case Engine** | N/A | Global | Create `DemoStateContext` wrapping the App. Centralizes the "Demo Case" (Applicant Profile, Approvals, Documents, CA Status, Inspections). |
| **Demo Role Switcher** | `Navbar.tsx`, `page.tsx` | Top Right Navbar | Add a distinct `[ Demo Role ▼ ]` dropdown replacing the hardcoded horizontal tabs. Add "CA" role. |
| **Applicant Flow** | `ApplicantDiscoveryFlow.tsx`, `RegulatoryJourneyView.tsx` | Applicant Portal | Wire to `DemoStateContext`. Add "Find CA" button in the Journey View. Connect document uploads to global state. |
| **CA / Consultant Portal** | *None* | CA Portal | Create `CAWorkspace.tsx`. Implement "My Cases" list, Case Detail view (Left: Applicant answers, Center: Roadmap, Right: CA Actions/Chat). |
| **CA ↔ App Chat & Requests**| *None* | CA & Applicant Portals | Implement local state messaging array. Implement "Suggest Change" / "Request Document" features. |
| **Government Command** | `GovernmentCommand.tsx` | Government Portal | Modify to read from `DemoStateContext` instead of static `BOTTLENECK_DATA`. Add Application Review (Approve/Reject). |
| **Inspector Workspace** | `InspectorWorkspace.tsx` | Inspector Portal | Read active inspection jobs from `DemoStateContext`. Wire "Optimize Route" button to actually fetch `POST /api/optimize-route`. Update global case status on inspection completion. |

## Execution Plan

1. **Step 1: Global Demo State**: Create `src/lib/context/DemoStateContext.tsx`. This will hold `activeCase`, `messages`, `approvals`, and `documents` to act as the single source of truth for the demo loop.
2. **Step 2: Role Router**: Update `page.tsx` and `Navbar.tsx` to include the distinct `[ Demo Role ▼ ]` dropdown, switching between the 4 personas.
3. **Step 3: CA Portal Creation**: Build `src/components/ca/CAWorkspace.tsx` strictly using the existing white/navy/green NSWS styling.
4. **Step 4: Wiring the Applicant**: Hook the `ApplicantDiscoveryFlow` and `DiscoveryApplicationWorkspace` to push and read from the shared context. Add the "Request CA Assistance" handoff.
5. **Step 5: Wiring the Government**: Hook `GovernmentCommand` to receive the application, modify approval statuses (e.g. Pending → Action Required), and assign inspections.
6. **Step 6: Wiring the Inspector**: Hook `InspectorWorkspace` to receive the assigned inspection, call the route optimization API, and mark the inspection as complete.

*Proceeding to implement Step 1 and Step 2...*
