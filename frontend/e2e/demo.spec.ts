import { test, Page } from '@playwright/test';

// ─── TIMING CONSTANTS ───────────────────────────────────────────────────────
// Each pause is tuned to match a 3:11 total runtime.
// You can tweak READ_TIME, SHORT_PAUSE, etc. to slow down or speed up sections.

const SHORT_PAUSE = 1200;   // Between clicks
const READ_TIME   = 2500;   // Let evaluator read a screen
const LONG_READ   = 4000;   // Important moments

const pause = (page: Page, ms: number) => page.waitForTimeout(ms);

test.use({
  launchOptions: {
    // This opens a REAL visible browser window (not headless)
    headless: false,
  },
  viewport: { width: 1440, height: 900 },
});

test.setTimeout(360000); // 6 mins max

test('PramaanFlow — SIH Final Demo Recording', async ({ page }) => {

  // ═══════════════════════════════════════════════════════════
  //  0:00 ──► Open Applicant Portal
  // ═══════════════════════════════════════════════════════════
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pause(page, READ_TIME);

  // Optional: reset demo if button exists
  try {
    const resetBtn = page.getByRole('button', { name: /reset demo/i });
    if (await resetBtn.isVisible({ timeout: 2000 })) {
      await resetBtn.click();
      await pause(page, READ_TIME);
    }
  } catch (e) { /* no reset button, fine */ }

  // ═══════════════════════════════════════════════════════════
  //  0:00–0:13 ── Intent → Case Creation
  // ═══════════════════════════════════════════════════════════

  // Step 01: Intent
  await page.getByText('Start a new business').first().click();
  await pause(page, SHORT_PAUSE);
  await page.getByText('Entity already incorporated').first().click();
  await pause(page, READ_TIME);

  // Continue to Step 02
  const continueBtn = page.getByRole('button', { name: /continue/i });
  await continueBtn.click();
  await pause(page, SHORT_PAUSE);

  // ═══════════════════════════════════════════════════════════
  //  0:13–0:27 ── Business Activity (Dynamic Questions)
  // ═══════════════════════════════════════════════════════════

  // Step 02: Business Type
  await page.getByText('Food Processing').click();
  await pause(page, SHORT_PAUSE);

  // Sub-type appears dynamically ──────────────────
  await page.getByText('Dairy Processing', { exact: true }).click();
  await pause(page, SHORT_PAUSE);

  // Another level appears dynamically ─────────────
  await page.getByText('Commercial Dairy Processing').click();
  await pause(page, READ_TIME);

  await page.getByRole('button', { name: /continue/i }).click();
  await pause(page, SHORT_PAUSE);

  // ═══════════════════════════════════════════════════════════
  //  Step 03: Project Details — More Dynamic Questions
  // ═══════════════════════════════════════════════════════════

  // 25,000 L/day
  await page.getByText('25,000 L/day').click();
  await pause(page, SHORT_PAUSE);

  // Investment amount
  try {
    const investInput = page.getByPlaceholder('Enter amount').first();
    await investInput.fill('25');
    await pause(page, SHORT_PAUSE);
  } catch (e) { /* handle gracefully */ }

  // Power Requirement appears dynamically
  try {
    const powerInput = page.getByPlaceholder('e.g. 500 kW');
    await powerInput.fill('800 kW');
    await pause(page, SHORT_PAUSE);
  } catch (e) {}

  // Hazardous chemicals question appears
  await page.getByText('Yes (Requires PESO').click();
  await pause(page, READ_TIME);

  await page.getByRole('button', { name: /continue/i }).click();
  await pause(page, SHORT_PAUSE);

  // ═══════════════════════════════════════════════════════════
  //  0:27–0:37 ── Location (Maharashtra → Pune → Khed → Chakan MIDC)
  // ═══════════════════════════════════════════════════════════
  try {
    await page.getByText('Maharashtra', { exact: true }).click();
    await pause(page, 800);
    await page.getByText('Pune', { exact: true }).click();
    await pause(page, 800);
    await page.getByText('Khed', { exact: true }).click();
    await pause(page, 800);
    await page.getByText('Chakan MIDC', { exact: true }).click();
    await pause(page, 800);
  } catch (e) {}

  await pause(page, READ_TIME); // Let map / geo result breathe

  // Generate Intelligence
  try {
    const genBtn = page.getByRole('button', { name: /Generate Regulatory Intelligence/i });
    if (await genBtn.isVisible({ timeout: 2000 })) {
      await genBtn.click();
    } else {
      // Try Continue as fallback
      await page.getByRole('button', { name: /continue/i }).click();
    }
  } catch (e) {
    await page.getByRole('button', { name: /continue/i }).click();
  }
  await pause(page, 1000);

  // ═══════════════════════════════════════════════════════════
  //  0:37–0:52 ── Regulatory Intelligence Loading & Review
  // ═══════════════════════════════════════════════════════════

  // Wait for analysis to complete
  try {
    await page.waitForSelector('text=View Master Statutory Roadmap', { timeout: 20000 });
  } catch (e) {
    await pause(page, 5000); // fallback wait
  }
  
  await pause(page, SHORT_PAUSE);
  // Scroll slowly through: Summary → Approvals → Authorities → Documents → Signals
  await page.mouse.wheel(0, 300); await pause(page, 1000);
  await page.mouse.wheel(0, 300); await pause(page, 1000);
  await page.mouse.wheel(0, 300); await pause(page, READ_TIME);
  // Scroll back to top
  await page.mouse.wheel(0, -900); await pause(page, 500);

  // ═══════════════════════════════════════════════════════════
  //  0:52–1:12 ── Regulatory Journey / Roadmap
  // ═══════════════════════════════════════════════════════════
  
  // Click "View Master Statutory Roadmap"
  try {
    await page.getByText('View Master Statutory Roadmap').click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // Scroll through roadmap
  await page.mouse.wheel(0, 400); await pause(page, 1000);
  await page.mouse.wheel(0, 400); await pause(page, 1000);

  // Click on first approval card to expand it (shows Department, SLA, Fee, Why Required)
  try {
    await page.locator('[class*="space-y-4"] > div').first().click();
    await pause(page, LONG_READ);  // Let evaluator read SLA / Department / Fee
    await page.mouse.wheel(0, 400); await pause(page, 1000);
  } catch (e) {}

  // Scroll to Government Support section
  await page.mouse.wheel(0, 600); await pause(page, READ_TIME);
  await page.mouse.wheel(0, 400); await pause(page, READ_TIME);

  // Prepare Application button
  try {
    const prepBtn = page.getByRole('button', { name: /Prepare Application/i }).first();
    await prepBtn.click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  1:12–1:30 ── Government Support + Evidence Vault
  // ═══════════════════════════════════════════════════════════

  // Scroll to show "WHAT PRAMAANFLOW ALREADY KNOWS"
  await page.mouse.wheel(0, 0); await pause(page, READ_TIME);

  // Scroll to documents section
  await page.mouse.wheel(0, 500); await pause(page, SHORT_PAUSE);

  // Click a document to show it
  try {
    await page.locator('text=Site Plan').first().click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  1:30–1:54 ── Readiness + Send to CA
  // ═══════════════════════════════════════════════════════════
  await page.mouse.wheel(0, 600); await pause(page, READ_TIME);
  await page.mouse.wheel(0, 400); await pause(page, SHORT_PAUSE);

  // Send to CA button
  try {
    const sendBtn = page.getByRole('button', { name: /Send to CA/i });
    await sendBtn.click();
    await pause(page, LONG_READ);
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  1:54 ── HARD CUT: CA Portal
  // ═══════════════════════════════════════════════════════════
  
  // Switch role to CA
  try {
    // Try clicking the CA role button in the navbar
    const caBtn = page.getByRole('button', { name: /CA/i });
    await caBtn.first().click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // Scroll through CA workspace: Project Details → Regulatory Roadmap → Evidence → Document Review
  await page.mouse.wheel(0, 400); await pause(page, SHORT_PAUSE);
  
  // Click tabs if available
  try {
    await page.getByRole('button', { name: 'Project Details' }).click(); await pause(page, READ_TIME);
  } catch (e) {}
  try {
    await page.getByRole('button', { name: 'Regulatory Roadmap' }).click(); await pause(page, READ_TIME);
  } catch (e) {}
  try {
    await page.getByRole('button', { name: 'Evidence Vault' }).click(); await pause(page, READ_TIME);
  } catch (e) {}
  try {
    await page.getByRole('button', { name: 'Document Review' }).click(); await pause(page, READ_TIME);
  } catch (e) {}
  try {
    await page.getByRole('button', { name: 'Communication' }).click(); await pause(page, READ_TIME);
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  2:22 ── HARD CUT: Government Portal
  // ═══════════════════════════════════════════════════════════
  
  try {
    const govBtn = page.getByRole('button', { name: /government/i });
    await govBtn.first().click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // Navigate through Government Portal tabs
  try { await page.getByRole('button', { name: 'Incoming Cases' }).click(); await pause(page, SHORT_PAUSE); } catch (e) {}
  await page.mouse.wheel(0, 400); await pause(page, SHORT_PAUSE);
  try { await page.getByRole('button', { name: 'Jurisdiction' }).click(); await pause(page, READ_TIME); } catch (e) {}
  try { await page.getByRole('button', { name: 'Regulatory Review' }).click(); await pause(page, READ_TIME); } catch (e) {}
  try { await page.getByRole('button', { name: 'Evidence' }).click(); await pause(page, READ_TIME); } catch (e) {}
  try { await page.getByRole('button', { name: 'Timeline' }).click(); await pause(page, READ_TIME); } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  2:39 ── HARD CUT: Inspector Portal
  // ═══════════════════════════════════════════════════════════
  
  try {
    const inspBtn = page.getByRole('button', { name: /inspector/i });
    await inspBtn.first().click();
    await pause(page, READ_TIME);
  } catch (e) {}

  // Inspector workflow
  await page.mouse.wheel(0, 200); await pause(page, SHORT_PAUSE);
  
  // Click Verify GPS
  try {
    await page.getByRole('button', { name: 'Verify GPS' }).click();
    await pause(page, SHORT_PAUSE);
  } catch (e) {}

  // Check a couple of checklist items
  try {
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).click({ force: true }); await pause(page, 600);
    await checkboxes.nth(1).click({ force: true }); await pause(page, 600);
    await checkboxes.nth(2).click({ force: true }); await pause(page, 600);
  } catch (e) {}

  // Type findings
  try {
    await page.getByPlaceholder('Enter field observations...').fill('Site boundaries verified. Equipment matches DPR specifications. No violations observed.');
    await pause(page, READ_TIME);
  } catch (e) {}

  // Submit Report
  try {
    await page.getByRole('button', { name: 'Submit Report' }).click();
    await pause(page, LONG_READ);
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════
  //  2:47 ── Back to Government: Inspection Report + Decision
  // ═══════════════════════════════════════════════════════════
  
  try {
    const govBtn = page.getByRole('button', { name: /government/i });
    await govBtn.first().click();
    await pause(page, READ_TIME);
  } catch (e) {}

  await page.mouse.wheel(0, 400); await pause(page, SHORT_PAUSE);
  await page.mouse.wheel(0, 400); await pause(page, READ_TIME);

  // ═══════════════════════════════════════════════════════════
  //  2:56–3:11 ── THE FINAL PROOF: Case Timeline / Audit Trail
  // ═══════════════════════════════════════════════════════════
  
  try {
    await page.getByRole('button', { name: 'Timeline' }).click();
    await pause(page, SHORT_PAUSE);
  } catch (e) {}

  // Scroll slowly through the audit trail events
  await page.mouse.wheel(0, 200); await pause(page, 1000);
  await page.mouse.wheel(0, 200); await pause(page, 1000);
  await page.mouse.wheel(0, 200); await pause(page, 1000);
  await page.mouse.wheel(0, 200); await pause(page, 1000);

  // Final hold on screen — 2 seconds on the complete timeline
  await pause(page, 3000);

  // ═══════════════════════════════════════════════════════════
  //  DONE! — 3:11 approximate
  // ═══════════════════════════════════════════════════════════
  console.log('✅ Demo automation complete. STOP YOUR SCREEN RECORDER NOW.');
});
