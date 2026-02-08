
import React, { useState } from 'react';
import { Icons } from '../constants';

interface HeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  activeSection: 'places' | 'food';
}

const TRENDING_CITIES = ['Tokyo', 'Amalfi Coast', 'Paris', 'Seoul', 'Lisbon', 'Kyoto'];

export const Hero: React.FC<HeroProps> = ({ onSearch, isSearching, activeSection }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleQuickSearch = (city: string) => {
    setQuery(city);
    onSearch(city);
  };

  return (
    <div className="relative pt-40 pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-blue-950 tracking-tighter leading-[1.05]">
            Discover the <br/>
            <span className="text-blue-600 inline-block hover:scale-105 transition-transform cursor-default">Unforgettable.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Personalized {activeSection === 'places' ? 'itineraries' : 'culinary maps'} generated instantly by Lumina AI.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group animate-in fade-in zoom-in-95 duration-700 delay-200">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Where should we go for ${activeSection === 'places' ? 'sightseeing' : 'tasting'}?`}
              className="w-full h-20 py-5 pl-14 pr-40 rounded-3xl glass border-white/60 focus:bg-white/95 focus:ring-[12px] focus:ring-blue-500/5 focus:border-blue-400 text-xl text-blue-950 font-semibold transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] outline-none placeholder:text-slate-300"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-3 top-3 bottom-3 bg-blue-950 text-white px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-[0.96] disabled:bg-slate-300 disabled:cursor-not-allowed overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Explore <Icons.Plane /></>
                )}
              </span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Trending:</span>
            {TRENDING_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleQuickSearch(city)}
                className="px-4 py-1.5 rounded-full bg-white/50 border border-white/80 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};