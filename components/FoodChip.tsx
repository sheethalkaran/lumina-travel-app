
import React from 'react';

export const FoodChip: React.FC<{ name: string; description?: string; placeType?: string; delay?: number }> = ({ name, description, placeType, delay = 0 }) => {
  return (
    <div 
      className="group relative glass rounded-[1.5rem] p-5 border-white/80 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex flex-col bg-white/70"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Must Try</span>
          <h4 className="text-2xl font-black text-blue-950 uppercase truncate leading-none">{name}</h4>
        </div>
        <div className="w-8 h-8 rounded-lg bg-orange-50/50 flex items-center justify-center text-orange-500 border border-orange-100/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
        </div>
      </div>

      <div className="mb-2.5">
        <span className="text-[9px] font-black uppercase text-blue-900 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/30">{placeType}</span>
      </div>
      
      <div className="flex-grow pt-2.5 border-t border-slate-50">
        <p className="text-xl text-slate-800 font-bold leading-tight">
          "{description}"
        </p>
      </div>
    </div>
  );
};
