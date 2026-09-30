const fs = require('fs');
const code = fs.readFileSync('frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx', 'utf-8');
const lines = code.split('\n');

let braceCount = 0;
for (let i = 0; i < Math.min(lines.length, 210); i++) {
  for (const ch of lines[i]) {
    if (ch === '{') braceCount++;
    if (ch === '}') braceCount--;
  }
  if (i >= 195) {
    console.log('Line ' + (i+1) + ': braces=' + braceCount + ' | ' + lines[i].substring(0, 80));
  }
}

// Also check total brace balance
braceCount = 0;
for (let i = 0; i < lines.length; i++) {
  for (const ch of lines[i]) {
    if (ch === '{') braceCount++;
    if (ch === '}') braceCount--;
  }
}
console.log('\nTotal file brace balance: ' + braceCount);

// Check for multiple return ( patterns
const returnMatches = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^\s+return\s*\(/)) {
    returnMatches.push(i + 1);
  }
}
console.log('Return statement lines: ' + returnMatches.join(', '));

// Check if there's a closing } for the function before the main return
for (let i = 195; i < 205; i++) {
  if (lines[i] && lines[i].trim() === '}') {
    console.log('Found lone } at line ' + (i+1));
  }
}
