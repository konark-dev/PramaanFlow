import { getPgPool } from './postgres-client';
import { runQuery } from '../graph/neo4j-client';

export async function syncProjectToRegulatoryGraph(projectId: string) {
  const pool = getPgPool();
  
  // 1. Read project from PostgreSQL
  const res = await pool.query(
    'SELECT id, project_name, sector, proposed_investment_inr, latitude, longitude FROM project_sites WHERE id = $1',
    [projectId]
  );
  
  if (res.rows.length === 0) {
    throw new Error(`Project ${projectId} not found in PostgreSQL`);
  }
  
  const project = res.rows[0];
  
  // 2. Determine Jurisdiction via PostGIS (simplified for demo)
  // In a real app we'd intersect with industrial_zones/environmental_buffers
  const gisRes = await pool.query(`
    SELECT district, state 
    FROM industrial_zones 
    WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326))
    LIMIT 1
  `, [project.longitude, project.latitude]);
  
  let district = 'Unknown';
  let state = 'Maharashtra';
  
  if (gisRes.rows.length > 0) {
    district = gisRes.rows[0].district;
    state = gisRes.rows[0].state || state;
  }
  
  // 3. Create/Update Project in Neo4j
  await runQuery(`
    MERGE (p:Project {id: $id})
    SET p.name = $name,
        p.sector = $sector,
        p.investment = $investment,
        p.latitude = $latitude,
        p.longitude = $longitude
  `, {
    id: project.id,
    name: project.project_name,
    sector: project.sector,
    investment: parseFloat(project.proposed_investment_inr || '0'),
    latitude: project.latitude,
    longitude: project.longitude
  });
  
  // 4. Create Jurisdiction and Relationships
  await runQuery(`
    MERGE (j:Jurisdiction {id: $state})
    SET j.name = $state,
        j.level = 'STATE'
        
    MERGE (d:Jurisdiction {id: $district})
    SET d.name = $district,
        d.level = 'DISTRICT'
        
    WITH j, d
    MATCH (p:Project {id: $projectId})
    MERGE (p)-[:LOCATED_IN]->(j)
    MERGE (p)-[:LOCATED_IN]->(d)
  `, {
    state,
    district,
    projectId: project.id
  });
  
  console.log(`Synced Project ${project.id} to Neo4j`);
  return { project, state, district };
}
