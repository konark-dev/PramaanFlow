const fs = require('fs');

let gov = fs.readFileSync('src/components/gov/GovernmentWorkspace.tsx', 'utf8');
gov = gov.replace(/setSelectedTab/g, 'setSubTab');
fs.writeFileSync('src/components/gov/GovernmentWorkspace.tsx', gov);

let q = fs.readFileSync('src/lib/regulatory-questions.ts', 'utf8');
q = q.replace(/units:/g, 'unit:');
fs.writeFileSync('src/lib/regulatory-questions.ts', q);
