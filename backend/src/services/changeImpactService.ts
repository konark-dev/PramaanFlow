import { prisma } from '../lib/prisma';
import { getProjectProfile } from './projectService';
import { evaluateProjectAgainstRules } from '../rule-engine/evaluate';
import { EvaluableRule, ProjectProfile, RuleCondition } from '../rule-engine/types';
import { NotFoundError } from '../lib/errors';

export async function computeImpact(projectId: string, changedFacts: Record<string, unknown>) {
  // 1. Load project's current facts
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { attributes: true },
  });
  if (!project) throw new NotFoundError('Project not found');

  const currentProfile: ProjectProfile = {
    sector: project.sector,
    district: project.district,
    industrial_area: project.industrial_area,
    investment_amount: Number(project.investment_amount),
    employee_count: project.employee_count,
    stage: project.stage,
    ...Object.fromEntries(project.attributes.map((a) => [a.key, a.value])),
  };
  
  const rules = await prisma.applicabilityRule.findMany({ where: { active: true } });
  const evaluableRules: EvaluableRule[] = rules.map((r) => ({
    id: r.id,
    approval_type_id: r.approval_type_id,
    rule_name: r.rule_name,
    conditions: r.conditions as unknown as RuleCondition[],
    jurisdiction: r.jurisdiction,
    sector: r.sector,
    source_citation: r.source_citation,
    version: r.version,
  }));

  // 2. Run evaluate() to get current required approvals
  const currentEval = evaluateProjectAgainstRules(currentProfile, evaluableRules);
  const currentApprovalIds = new Set(currentEval.applicableApprovals);
  
  // 3. Apply changedFacts to a copy of the facts
  const proposedProfile: ProjectProfile = { ...currentProfile, ...changedFacts };
  
  // 4. Run evaluate() again
  const proposedEval = evaluateProjectAgainstRules(proposedProfile, evaluableRules);
  const proposedApprovalIds = new Set(proposedEval.applicableApprovals);

  // 5. Diff the results
  const newlyRequired = proposedEval.applicableApprovals.filter(id => !currentApprovalIds.has(id));
  const noLongerRequired = currentEval.applicableApprovals.filter(id => !proposedApprovalIds.has(id));
  
  // Rule changed logic: an approval is still required but the rule ID changed
  const currentMatchesMap = new Map(currentEval.matches.map(m => [m.approval_type_id, m.rule_id]));
  const proposedMatchesMap = new Map(proposedEval.matches.map(m => [m.approval_type_id, m.rule_id]));
  
  const ruleChanged = proposedEval.applicableApprovals.filter(id => {
    return currentApprovalIds.has(id) && currentMatchesMap.get(id) !== proposedMatchesMap.get(id);
  });

  const affectedApprovalIds = new Set([...newlyRequired, ...noLongerRequired, ...ruleChanged]);

  if (affectedApprovalIds.size === 0) {
    return {
      message: "No configured impact found: regulatory verification not completed",
      rulesChecked: evaluableRules.length,
      impacts: []
    };
  }

  // Pre-load necessary data for all affected items
  const approvals = await prisma.approvalType.findMany({
    where: { id: { in: Array.from(affectedApprovalIds) } },
    include: { department: true }
  });
  const approvalMap = new Map(approvals.map(a => [a.id, a]));

  const dependencies = await prisma.approvalDependency.findMany({
    where: { prerequisite_approval_type_id: { in: Array.from(affectedApprovalIds) } },
    include: { dependent_approval: true }
  });

  const slaPolicies = await prisma.sLAPolicy.findMany({
    where: { approval_type_id: { in: Array.from(affectedApprovalIds) } }
  });

  const documentRequirements = await prisma.documentRequirement.findMany({
    where: { approval_type_id: { in: Array.from(affectedApprovalIds) } }
  });

  // Helper to find which condition actually flipped due to changedFacts
  const findFlippedCondition = (ruleId: string) => {
    const rule = evaluableRules.find(r => r.id === ruleId);
    if (!rule) return null;
    for (const cond of rule.conditions) {
      if (cond.field in changedFacts && currentProfile[cond.field] !== proposedProfile[cond.field]) {
        return cond;
      }
    }
    return rule.conditions[0] || null; // fallback
  };

  const impacts: any[] = [];

  for (const appId of affectedApprovalIds) {
    const approval: any = approvalMap.get(appId);
    if (!approval) continue;

    let type = '';
    let ruleId = '';
    
    if (newlyRequired.includes(appId)) {
      type = 'newly_required';
      ruleId = proposedMatchesMap.get(appId)!;
    } else if (noLongerRequired.includes(appId)) {
      type = 'no_longer_required';
      ruleId = currentMatchesMap.get(appId)!;
    } else {
      type = 'rule_changed';
      ruleId = proposedMatchesMap.get(appId)!;
    }

    const flippedCond = findFlippedCondition(ruleId);
    
    const downstream = dependencies
      .filter(d => d.prerequisite_approval_type_id === appId)
      .map(d => ({
        id: d.dependent_approval_type_id,
        name: d.dependent_approval.name,
        type: d.dependency_type
      }));

    const docs = documentRequirements
      .filter(dr => dr.approval_type_id === appId)
      .map(dr => ({
        id: dr.id,
        name: dr.name,
        revalidation_required: true
      }));

    const sla = slaPolicies.find(s => s.approval_type_id === appId);

    impacts.push({
      approval_id: appId,
      approval_name: approval.name,
      impact_type: type,
      rule_id: ruleId,
      condition_fired: flippedCond ? `${flippedCond.field} ${flippedCond.operator} ${flippedCond.value}` : 'Unknown',
      old_value: flippedCond ? currentProfile[flippedCond.field] : null,
      new_value: flippedCond ? proposedProfile[flippedCond.field] : null,
      label: type === 'newly_required' ? 'potential' : 'rule-confirmed',
      reason: `Fact ${flippedCond?.field || 'unknown'} changed, triggering rule ${ruleId}`,
      downstream_blocked: downstream,
      stale_documents: docs,
      owner: approval.department?.name || 'Unknown',
      sla_policy: sla ? `${sla.duration_days} days` : 'Not specified',
      source_citation: evaluableRules.find(r => r.id === ruleId)?.source_citation || null,
    });
  }

  return {
    message: 'Impact computed',
    rulesChecked: evaluableRules.length,
    impacts
  };
}
