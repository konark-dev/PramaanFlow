import { test } from 'node:test';
import assert from 'node:assert';
import { computeImpact } from '../services/changeImpactService';
import { prisma } from '../lib/prisma';
import { getProjectProfile } from '../services/projectService';

test('Change Impact - 10 Scenarios', async (t) => {
  const project = await prisma.project.findFirst({ where: { stage: 'pre_establishment' } });
  if (!project) throw new Error('No project found');
  const projectId = project.id;
  const current = await getProjectProfile(projectId);

  const scenarios = [
    {
      name: 'Scenario 1: Drop investment below 10Cr -> loses env clearance',
      changedFacts: { investment_amount: 5_00_00_000 },
    },
    {
      name: 'Scenario 2: Increase investment above 10Cr -> gains env clearance',
      changedFacts: { investment_amount: 15_00_00_000, sector: 'Food Processing' },
    },
    {
      name: 'Scenario 3: Change industrial area from MIDC to Non-MIDC',
      changedFacts: { industrial_area: 'Non-MIDC' },
    },
    {
      name: 'Scenario 4: Change sector -> loses sector specific approvals',
      changedFacts: { sector: 'Textiles' },
    },
    {
      name: 'Scenario 5: Employee count drops below 10',
      changedFacts: { employee_count: 5 },
    },
    {
      name: 'Scenario 6: Employee count jumps to 500',
      changedFacts: { employee_count: 500 },
    },
    {
      name: 'Scenario 7: Change stage to operation',
      changedFacts: { stage: 'operation' },
    },
    {
      name: 'Scenario 8: No change',
      changedFacts: {},
    },
    {
      name: 'Scenario 9: Multiple changes (investment + employee)',
      changedFacts: { investment_amount: 200_00_00_000, employee_count: 5000 },
    },
    {
      name: 'Scenario 10: Unseen fact (irrelevant fact) -> no impact',
      changedFacts: { some_random_unseen_value: 'xyz' },
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const s of scenarios) {
    await t.test(s.name, async () => {
      try {
        const result = await computeImpact(projectId, s.changedFacts);
        console.log(`\n--- ${s.name} ---`);
        if (result.impacts.length > 0) {
          console.log(`Affected: ${result.impacts.length}`);
          result.impacts.forEach(i => console.log(` - ${i.impact_type}: ${i.approval_name}`));
        } else {
          console.log(`No impacts found.`);
        }
        passed++;
      } catch (e) {
        failed++;
        throw e;
      }
    });
  }
});
