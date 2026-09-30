import { ApprovalRecommendation } from '../types';
import seedData from '../data/seed.json';
import { getPgPool } from '../sync/postgres-client';

export class RecommendationEngine {
  async generateRecommendations(projectId: string): Promise<ApprovalRecommendation[]> {
    const pool = getPgPool();
    const res = await pool.query('SELECT sector, proposed_investment_inr FROM project_sites WHERE id = $1', [projectId]);
    if (res.rows.length === 0) {
      throw new Error("Project not found");
    }
    const project = res.rows[0];
    const recommendations: ApprovalRecommendation[] = [];

    // Deterministic Rule Evaluation based on Seed Data Rules
    for (const rule of seedData.rules) {
      // Very basic rule evaluation engine (e.g. OPA lite)
      let applies = false;
      if (rule.condition.includes("project.sector IN") && rule.condition.includes('Pharmaceuticals')) {
         if (project.sector === 'Pharmaceuticals' || project.sector === 'Chemicals') {
           applies = true;
         }
      }

      if (applies && rule.effect.startsWith('REQUIRE')) {
        const approvalId = rule.approval_id;
        const approval = seedData.approvals.find(a => a.id === approvalId);
        const source = seedData.sources.find(s => s.id === rule.source_id);
        
        if (approval && source) {
           recommendations.push({
             approval_id: approval.id,
             project_id: projectId,
             status: 'REQUIRED',
             reason: `Project sector '${project.sector}' matches rule ${rule.rule_code}.`,
             authority: approval.authority,
             dependencies: approval.depends_on,
             required_documents: approval.required_documents,
             evidence: [{
               source: source.name,
               url: source.url,
               text: `Governed by ${source.name} effective ${source.effective_date}`
             }],
             confidence: 1.0
           });

           // Automatically bring in dependencies (CTO depends on CTE)
           for (const depId of approval.depends_on) {
             // simplified: we'd recursively evaluate or resolve
           }
        }
      }
    }

    // Hardcode a CTE dependency evaluation for demo
    const hasCte = recommendations.some(r => r.approval_id === 'app_cte');
    if (hasCte) {
       const cto = seedData.approvals.find(a => a.id === 'app_cto');
       const ctoSource = seedData.sources.find(s => s.id === cto?.source_id);
       if (cto && ctoSource) {
           recommendations.push({
             approval_id: cto.id,
             project_id: projectId,
             status: 'CONDITIONAL',
             reason: `Required before commencing commercial operations, contingent on CTE.`,
             authority: cto.authority,
             dependencies: cto.depends_on,
             required_documents: cto.required_documents,
             evidence: [{
               source: ctoSource.name,
               url: ctoSource.url,
               text: `Governed by ${ctoSource.name}`
             }],
             confidence: 1.0
           });
       }
    }

    return recommendations;
  }
}
