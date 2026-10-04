const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/login/page.tsx', 'utf8');

content = content.replace(
  /roleKey: "MPCB_OFFICER"[\s\S]*?icon: Landmark,/,
  `roleKey: "MPCB_OFFICER",
    email: "pcb.officer@demo.local",
    label: "Competent Authority — MPCB",
    title: "Dr. Vivek Sharma · Pollution Control",
    sub: "Consent to Establish (CTE) & Operate (CTO)",
    dest: "/government/work-queue",
    icon: Factory,`
);

content = content.replace(
  /roleKey: "MIDC_OFFICER"[\s\S]*?icon: Landmark,/,
  `roleKey: "MIDC_OFFICER",
    email: "officer@demo.local",
    label: "Competent Authority — MIDC",
    title: "Sunil Patil · Land Allotment",
    sub: "Plot Allotment & Infrastructure Scrutiny Desk",
    dest: "/government/work-queue",
    icon: Landmark,`
);

fs.writeFileSync('frontend/src/app/login/page.tsx', content);
