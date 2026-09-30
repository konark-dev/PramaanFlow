import { RecommendationEngine } from '../recommendation/recommendation-engine';
import { syncProjectToRegulatoryGraph } from '../sync/project-sync';
import { OPAValidator } from '../rules/opa-validator';
import { ProvenanceSystem } from '../provenance/provenance';

async function testCompleteFlow() {
  console.log("Starting E2E Flow Test");
  
  // Note: this assumes you have inserted a project into postgres with ID 'project-uuid'
  // In a real environment, you'd fetch an actual UUID from the DB. 
  // Let's assume we pass it in.
  const projectId = process.argv[2];
  if (!projectId) {
     console.error("Please provide a project UUID as argument");
     process.exit(1);
  }

  try {
     console.log(`1. Syncing project ${projectId}...`);
     await syncProjectToRegulatoryGraph(projectId);
     
     console.log(`2. Generating recommendations...`);
     const engine = new RecommendationEngine();
     const recs = await engine.generateRecommendations(projectId);
     console.log("Recommendations:", JSON.stringify(recs, null, 2));
     
     console.log(`3. OPA Validation...`);
     const opa = new OPAValidator();
     const validation = await opa.validateRecommendations(projectId, recs);
     console.log("Validation Result:", validation);

     console.log(`4. Provenance...`);
     const prov = new ProvenanceSystem();
     const provenance = prov.generateProvenanceChain(recs);
     console.log("Provenance:", JSON.stringify(provenance, null, 2));
     
     console.log("E2E Test completed successfully.");
     process.exit(0);
  } catch (error) {
     console.error("E2E Flow failed:", error);
     process.exit(1);
  }
}

testCompleteFlow();
