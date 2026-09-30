# Project to Regulatory Mapping

This file defines the mapping between the actual fields available in the existing PostgreSQL `project_sites` table and their regulatory meaning for the recommendation engine.

## PostgreSQL Table: `project_sites`

| Existing DB Field | Regulatory Meaning / Usage |
|-------------------|----------------------------|
| `id` | Unique identifier for the Project (used for Neo4j Node matching and sync) |
| `project_name` | Name of the project, useful for human-readable recommendations and logging. |
| `sector` | Industry sector (e.g., Pharmaceuticals, Food Processing). Determines sector-specific approvals and rules. |
| `proposed_investment_inr` | Investment amount. Triggers threshold-based rules (e.g., Mega Project status, MoEFCC vs SEIAA clearance limits). |
| `latitude` | Spatial Y coordinate. Used for reverse geocoding the jurisdiction. |
| `longitude` | Spatial X coordinate. Used for reverse geocoding the jurisdiction. |
| `geom` | PostGIS geometry point. Used to intersect with `industrial_zones` and `environmental_buffers` to determine specific local spatial rules. |

## Geospatial Derived Context (from `industrial_zones` & `environmental_buffers`)

When the project's `geom` intersects with the spatial tables, we derive:

| Geospatial Source | Derived Field | Regulatory Meaning / Usage |
|-------------------|---------------|----------------------------|
| `industrial_zones` | `zone_type` | Determines permissible industries (RED/ORANGE/GREEN/WHITE) and pre-cleared zoning. |
| `industrial_zones` | `expedited_clearance`| Flag indicating if the project is eligible for fast-track or automatic approvals based on location. |
| `industrial_zones` | `state` & `district` | Resolved Jurisdiction. Determines whether State or District level authorities govern the approvals. |
| `environmental_buffers` | `buffer_type` | Imposes restrictive conditions (e.g., EIA requirement, Zero Liquid Discharge) if intersecting. |
| `environmental_buffers` | `clearance_authority`| Identifies if MoEFCC or SEIAA is the approving body due to proximity to sensitive areas. |
