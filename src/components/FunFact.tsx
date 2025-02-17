'use client';

import React, { useState, useEffect } from 'react';
import { Info, Repeat } from 'lucide-react';

const FunFact = () => {
  const [facts, setFacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch three facts from the API
  const fetchFacts = async () => {
    try {
      setIsLoading(true);
      const responses = await Promise.all(
        [...Array(3)].map(() =>
          fetch('/api/funfact').then((res) => res.json())
        )
      );
      setFacts(responses.map((r) => r.fact));
    } catch (error) {
      console.error('Error fetching fun facts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  if (isLoading || facts.length === 0) {
    return (
      <div className="font-mono text-xs mt-12 text-white/40">
        Loading facts...
      </div>
    );
  }

  // Repeat the facts array several times to create a continuous scrolling ticker
  const repeatedFacts = new Array(5).fill(facts).flat();

  return (
    // Wrap the component with a max-width container (adjust max-w-xl as needed)
    <div className="max-w-xl mx-auto">
      <div className="font-mono text-xs mt-12 relative">
        {/* Use a grid layout with three columns: auto | 1fr | auto */}
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
          {/* Info Icon */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              <Info size={12} />
            </button>
            {showInfo && (
              <div className="absolute bottom-full mb-2 left-0 w-48 p-2 bg-white/10 backdrop-blur-sm rounded text-xs">
                These facts are true statements that hint at larger stories.
              </div>
            )}
          </div>

          {/* Ticker container */}
          <div
            className="overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`
                whitespace-nowrap
                ${isPaused ? 'animate-pause' : 'animate-ticker'}
              `}
            >
              {repeatedFacts.map((fact, index) => (
                <span key={index} className="inline-block mr-8 text-white/60">
                  {fact}
                </span>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchFacts}
            disabled={isLoading}
            className="text-white/40 hover:text-white/60 transition-colors disabled:text-white/20"
          >
            <Repeat size={12} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunFact;
