const fs = require('fs');
let content = fs.readFileSync('src/components/LandingDiagram.tsx', 'utf8');

content = content.replace(
  'export default function UserFlowDiagram() {',
  `import { ArrowRight } from 'lucide-react';\n\nexport function LandingDiagram({ onStart }: { onStart?: () => void }) {`
);

content = content.replace(
  '<div className="flex flex-wrap items-center gap-2 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">',
  `<div className="flex flex-col items-end gap-3">
        {onStart && (
          <button 
            onClick={onStart}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Start Interactive Demo <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">`
);

// also close the div
content = content.replace(
  '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">\n          <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 4. Statutory Authority\n        </span>\n      </div>\n    </div>',
  '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">\n          <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 4. Statutory Authority\n        </span>\n      </div>\n      </div>\n    </div>'
);

fs.writeFileSync('src/components/LandingDiagram.tsx', content);
