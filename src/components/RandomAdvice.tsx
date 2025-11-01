"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Lightbulb, ExternalLink } from 'lucide-react';
import { marked } from 'marked';
import Link from 'next/link';

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
    const interval = setInterval(fetchAdvice, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchAdvice]);

  if (loading && !advice) {
    return (
      <div className="mt-8 max-w-md space-y-3 mb-4">
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

  const renderedQuote = marked(advice.quote, { breaks: true });

  return (
    <div className="relative bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Lightbulb size={16} className="text-white/60" />
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">Advice</h3>
        </div>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group text-white"
          aria-label="Refresh advice"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4 pb-6">
        <div 
          className="text-white/80 font-serif text-base leading-relaxed font-medium italic border-l-2 border-yellow-400/40 pl-4 mb-4 prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedQuote }}
        />
        {advice.source && (
          <div className="text-white/50 font-mono text-xs tracking-wider">
            — {advice.source}
          </div>
        )}
      </div>
      <div className="ml-4 border-t border-white/10 pt-3">
        <Link 
          href="/advice"
          className="text-white/50 font-mono text-xs tracking-wider hover:text-white/80 transition-colors flex items-center gap-2 uppercase"
        >
          <span className="w-2 h-2 bg-white/30 rounded-full"></span>
          Advice
          <ExternalLink size={10} />
        </Link>
      </div>
      </div>
    </div>
  );
};

export default RandomAdvice;