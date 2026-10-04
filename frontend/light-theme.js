const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/login/page.tsx', 'utf8');

// Container
content = content.replace(/bg-slate-950/g, 'bg-gray-50');
content = content.replace(/text-gray-100/g, 'text-gray-900');
content = content.replace(/from-slate-900 via-slate-950 to-slate-900/g, 'from-gray-50 via-white to-gray-50');
content = content.replace(/border-slate-800/g, 'border-gray-200');

// Top Branding Bar removal / change to PramaanFlow
content = content.replace(
  /<div className="relative z-10 space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-extrabold text-lg tracking-tight">Pramaan Flow</span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Maharashtra Industrial Single Window Clearances System
              </p>
            </div>
          </div>
        </div>`
);

// General text colors
content = content.replace(/text-white text-3xl/g, 'text-gray-900 text-3xl');
content = content.replace(/text-slate-400/g, 'text-gray-500');
content = content.replace(/text-slate-300/g, 'text-gray-600');
content = content.replace(/text-slate-500/g, 'text-gray-400');
content = content.replace(/bg-slate-800/g, 'bg-gray-100');
content = content.replace(/border-slate-700/g, 'border-gray-200');

// Features pillars
content = content.replace(/bg-slate-900\/80/g, 'bg-white');
content = content.replace(/text-white text-xs font-semibold/g, 'text-gray-900 text-xs font-semibold');
content = content.replace(/hover:border-slate-700/g, 'hover:border-primary-300');

// Form side
content = content.replace(/bg-slate-900/g, 'bg-white');
content = content.replace(/bg-slate-800\/80/g, 'bg-gray-50');
content = content.replace(/hover:bg-slate-800\/80/g, 'hover:bg-gray-100');
content = content.replace(/border-slate-800\/80/g, 'border-gray-200');
content = content.replace(/bg-slate-700\/80/g, 'bg-gray-100');

// Input fields
content = content.replace(/bg-slate-950 border border-slate-750/g, 'bg-white border border-gray-200');
content = content.replace(/text-white placeholder-slate-500/g, 'text-gray-900 placeholder-gray-400');

// Modals
content = content.replace(/bg-black\/70/g, 'bg-black/40');
content = content.replace(/bg-slate-900 text-white/g, 'bg-white text-gray-900');
content = content.replace(/hover:text-white hover:bg-slate-800/g, 'hover:text-gray-900 hover:bg-gray-100');

// Fix text-white on left side Sign in text if any
content = content.replace(/text-white font-bold/g, 'text-gray-900 font-bold');

fs.writeFileSync('frontend/src/app/login/page.tsx', content);
