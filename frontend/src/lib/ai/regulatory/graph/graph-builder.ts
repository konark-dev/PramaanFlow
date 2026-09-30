import { runQuery } from './neo4j-client';
import seedData from '../data/seed.json';

export async function buildRegulatoryGraph() {
  console.log("Building regulatory graph from seed data...");
  
  // Create Sources
  for (const source of seedData.sources) {
    await runQuery(`
      MERGE (s:Source {id: $id})
      SET s.name = $name,
          s.url = $url,
          s.authority = $authority,
          s.source_type = $source_type,
          s.effective_date = $effective_date
    `, source);
  }

  // Create Departments
  for (const dept of seedData.departments) {
    await runQuery(`
      MERGE (d:Department {id: $id})
      SET d.name = $name,
          d.level = $level,
          d.state = $state
    `, dept);
  }

  // Create Approvals & Relationships
  for (const app of seedData.approvals) {
    await runQuery(`
      MERGE (a:Approval {id: $id})
      SET a.name = $name,
          a.description = $description,
          a.authority = $authority,
          a.jurisdiction = $jurisdiction,
          a.stage = $stage,
          a.status = $status
    `, app);

    // ISSUED_BY
    await runQuery(`
      MATCH (a:Approval {id: $appId})
      MATCH (d:Department {id: $deptId})
      MERGE (a)-[:ISSUED_BY]->(d)
    `, { appId: app.id, deptId: app.department });

    // DEFINED_BY (Source)
    await runQuery(`
      MATCH (a:Approval {id: $appId})
      MATCH (s:Source {id: $sourceId})
      MERGE (a)-[:DEFINED_BY]->(s)
    `, { appId: app.id, sourceId: app.source_id });

    // DEPENDS_ON
    for (const depId of app.depends_on) {
      await runQuery(`
        MATCH (a:Approval {id: $appId})
        MATCH (dep:Approval {id: $depId})
        MERGE (a)-[:DEPENDS_ON]->(dep)
      `, { appId: app.id, depId });
    }
    
    // REQUIRES_DOCUMENT
    for (const docId of app.required_documents) {
      await runQuery(`
        MATCH (a:Approval {id: $appId})
        MATCH (doc:Document {id: $docId})
        MERGE (a)-[:REQUIRES_DOCUMENT]->(doc)
      `, { appId: app.id, docId });
    }
  }

  // Create Documents
  for (const doc of seedData.documents) {
    await runQuery(`
      MERGE (d:Document {id: $id})
      SET d.name = $name,
          d.description = $description,
          d.mandatory = $mandatory
    `, doc);

    // DEFINED_BY
    if (doc.source_id) {
       await runQuery(`
        MATCH (d:Document {id: $docId})
        MATCH (s:Source {id: $sourceId})
        MERGE (d)-[:DEFINED_BY]->(s)
      `, { docId: doc.id, sourceId: doc.source_id });
    }
  }
  
  // Create Rules
  for (const rule of seedData.rules) {
    await runQuery(`
      MERGE (r:Rule {id: $id})
      SET r.rule_code = $rule_code,
          r.condition = $condition,
          r.effect = $effect
    `, rule);
    
    await runQuery(`
      MATCH (r:Rule {id: $ruleId})
      MATCH (a:Approval {id: $appId})
      MERGE (a)-[:GOVERNED_BY]->(r)
    `, { ruleId: rule.id, appId: rule.approval_id });
    
    await runQuery(`
      MATCH (r:Rule {id: $ruleId})
      MATCH (s:Source {id: $sourceId})
      MERGE (r)-[:DEFINED_BY]->(s)
    `, { ruleId: rule.id, sourceId: rule.source_id });
  }

  console.log("Regulatory graph built successfully.");
}
