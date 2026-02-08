
import React from 'react';
import { Destination } from '../types';
import { Icons } from '../constants';

export const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  return (
    <div className="group relative glass rounded-[1.5rem] p-5 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 border-white/80 overflow-hidden bg-white/60">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">Discovery</span>
        <div className="flex items-center gap-1 text-blue-950 font-black text-xs">
          <Icons.Star />
          {destination.rating?.toFixed(1) || "5.0"}
        </div>
      </div>

      <h3 className="text-xl font-black text-blue-950 leading-none mb-0.5 truncate">{destination.name}</h3>
      <p className="text-[9px] font-bold uppercase text-slate-400 mb-2 tracking-tighter">{destination.location}</p>

      <div className="flex-grow space-y-2">
        <p className="text-slate-900 text-lg font-bold leading-tight line-clamp-2">
          {destination.popularReason}
        </p>
        <p className="text-slate-600 text-lg font-medium leading-snug line-clamp-3">
          {destination.description}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-1">
          {destination.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">#{tag}</span>
          ))}
        </div>
        <div className="text-blue-600 scale-75 opacity-50 group-hover:opacity-100 transition-opacity">
          <Icons.Compass />
        </div>
      </div>
    </div>
  );
};
