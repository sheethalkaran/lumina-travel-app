
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DestinationCard } from './components/DestinationCard';
import { FoodChip } from './components/FoodChip';
import { Destination } from './types';
import { getTravelSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [activeSection, setActiveSection] = useState<'places' | 'food'>('places');
  const [error, setError] = useState(false);

  const performSearch = useCallback(async (location: string, section = activeSection) => {
    setIsSearching(true);
    setCurrentLocation(location);
    setError(false);
    try {
      const results = await getTravelSuggestions(location, section);
      setDestinations(results);
      setTimeout(() => {
        document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch {
      setError(true);
    } finally {
      setIsSearching(false);
    }
  }, [activeSection]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !currentLocation) return;
    setIsLoadingMore(true);
    try {
      const exclude = destinations.map(d => d.name);
      const additional = await getTravelSuggestions(currentLocation, activeSection, exclude);
      setDestinations(prev => [...prev, ...additional]);
    } catch {
      setError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSectionChange = (section: 'places' | 'food') => {
    setActiveSection(section);
    if (currentLocation) performSearch(currentLocation, section);
  };

  return (
    <div className="min-h-screen pb-12 bg-[#F9FBFF] text-blue-950 font-sans">
      <Header activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      <main className="space-y-4 relative z-10">
        <Hero onSearch={performSearch} isSearching={isSearching} activeSection={activeSection} />

        <div id="results-view" className="max-w-7xl mx-auto px-4 scroll-mt-24">
          {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase text-center tracking-widest">Service busy. Try again shortly.</div>}

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-[1.5rem] h-64 shimmer opacity-20" />)}
            </div>
          ) : (
            destinations.length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">
                    {activeSection === 'places' ? 'Top Destinations' : 'Signature Tastes'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Results for {currentLocation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSection === 'places' 
                    ? destinations.map(d => <DestinationCard key={d.id} destination={d} />)
                    : destinations.map((d, i) => <FoodChip key={d.id} name={d.name} description={d.description} placeType={d.placeType} delay={i * 20} />)
                  }
                </div>

                <div className="flex justify-center pt-8 pb-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="glass px-10 py-4 rounded-2xl text-blue-950 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 border border-white/80"
                  >
                    {isLoadingMore ? 'Loading More...' : 'Explore More'}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
