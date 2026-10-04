const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/login/page.tsx', 'utf8');

// Replace left over white text classes in headings/titles
content = content.replace(/text-white text-xl/g, 'text-gray-900 text-xl');
content = content.replace(/text-white truncate/g, 'text-gray-900 truncate');
content = content.replace(/text-white">Register/g, 'text-gray-900">Register');
content = content.replace(/bg-white text-white/g, 'bg-white text-gray-900');
content = content.replace(/hover:text-white/g, 'hover:text-gray-900');

// Fix the inputs border and text colors inside the modal
content = content.replace(/bg-gray-50 border border-slate-750 focus:border-emerald-500 rounded-lg text-white/g, 'bg-white border border-gray-200 focus:border-emerald-500 rounded-lg text-gray-900');

// Fix the demo accounts box borders
content = content.replace(/border-slate-800\/80/g, 'border-gray-200');

// Quick Demo Accounts UI
content = content.replace(/text-emerald-300/g, 'text-emerald-700');
content = content.replace(/text-slate-300/g, 'text-gray-700');

fs.writeFileSync('frontend/src/app/login/page.tsx', content);
