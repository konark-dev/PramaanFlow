import React from 'react';
import { ShieldCheck, Save } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-teal-400" />
        <div>
          <h1 className="font-bold text-lg">PramaanFlow</h1>
          <p className="text-xs text-slate-300 uppercase tracking-widest font-semibold">
            National Single Window System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium">
        <Save className="w-4 h-4 text-slate-400" />
        <span>Saved</span>
      </div>
    </header>
  );
}
