const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx', 'utf-8');

const returnIndex = code.indexOf('  return (`');
if (returnIndex !== -1) {
    const before = code.substring(0, returnIndex);
    const endStr = '`.substring(1)';
    const endIndex = code.lastIndexOf(endStr);
    
    let rawJSX = code.substring(returnIndex + 11, endIndex);
    rawJSX = rawJSX.replace(/\\`/g, '`');
    
    const newCode = before + '  return (\n' + rawJSX + '\n';
    fs.writeFileSync('frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx', newCode);
    console.log('Fixed JSX');
} else {
    console.log('Could not find the broken return statement');
}
