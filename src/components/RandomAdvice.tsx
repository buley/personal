"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface Advice {
  quote: string;
  source?: string;
}

const RandomAdvice: React.FC = () => {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/advice');
      if (response.ok) {
        const data: Advice = await response.json();
        setAdvice(data);
      }
    } catch (error) {
      console.error('Failed to fetch advice:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  useEffect(() => {
    const interval = setInterval(fetchAdvice, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchAdvice]);

  if (loading && !advice) {
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

  if (!advice) {
    return null;
  }

  return (
    <div className="mt-8 max-w-md border-t-4 border-white/25 pt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-white/50"></div>
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">Advice</h3>
        </div>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group"
          aria-label="Refresh advice"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4">
        <blockquote className="text-white/80 font-serif text-base leading-relaxed font-medium italic border-l-2 border-white/20 pl-4 mb-4">
          {advice.quote}
        </blockquote>
        {advice.source && (
          <div className="text-white/50 font-mono text-xs tracking-wider">
            — {advice.source}
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomAdvice;