"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Target } from 'lucide-react';

interface Mantra {
  mantra: string;
  section: string;
}

const RandomMantra: React.FC = () => {
  const [mantra, setMantra] = useState<Mantra | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMantra = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/random-mantra');
      if (response.ok) {
        const data: Mantra = await response.json();
        setMantra(data);
      }
    } catch (error) {
      console.error('Failed to fetch mantra:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMantra();
  }, [fetchMantra]);

  useEffect(() => {
    const interval = setInterval(fetchMantra, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchMantra]);

  if (loading && !mantra) {
    return (
      <div className="mt-8 max-w-md space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-white/5 w-3/4 rounded" />
          <div className="w-4 h-4 bg-white/5 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/5 w-full rounded" />
          <div className="h-4 bg-white/5 w-5/6 rounded" />
        </div>
      </div>
    );
  }

  if (!mantra) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Target size={16} className="text-white/60" />
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">Mantra</h3>
        </div>
        <button
          onClick={fetchMantra}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group"
          aria-label="Refresh mantra"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4">
        <p className="text-white/80 font-serif text-base leading-relaxed font-medium mb-3">
          {mantra.mantra}
        </p>
        <div className="text-white/50 font-mono text-xs tracking-wider uppercase">
          {mantra.section}
        </div>
      </div>
      </div>
    </div>
  );
};

export default RandomMantra;