
import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  activeSection: 'places' | 'food';
  onSectionChange: (section: 'places' | 'food') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <nav className="glass rounded-full px-5 py-2.5 flex items-center gap-6 shadow-2xl border border-white/60">
        <div className="flex items-center gap-3 pl-2 pr-5 border-r border-blue-950/10">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Icons.Plane />
          </div>
          <span className="font-black text-blue-950 text-xl tracking-tighter hidden sm:inline">LUMINA</span>
        </div>
        
        <div className="flex items-center bg-blue-950/5 p-1.5 rounded-full border border-blue-950/5">
          <button 
            onClick={() => onSectionChange('places')}
            className={`px-8 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              activeSection === 'places' 
              ? 'bg-white text-blue-600 shadow-lg shadow-blue-900/5 translate-z-0 scale-100' 
              : 'text-blue-950/60 hover:text-blue-950 hover:bg-white/40'
            }`}
          >
            Places
          </button>
          <button 
            onClick={() => onSectionChange('food')}
            className={`px-8 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              activeSection === 'food' 
              ? 'bg-white text-blue-600 shadow-lg shadow-blue-900/5 translate-z-0 scale-100' 
              : 'text-blue-950/60 hover:text-blue-950 hover:bg-white/40'
            }`}
          >
            Food
          </button>
        </div>

        <button className="bg-blue-950 text-white w-12 h-12 sm:w-auto sm:px-6 sm:py-2.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center border border-white/10">
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </span>
        </button>
      </nav>
    </header>
  );
};