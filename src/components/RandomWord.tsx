"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface LexiconEntry {
  word: string;
  definition: string;
}

const RandomWord: React.FC = () => {
  const [entry, setEntry] = useState<LexiconEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/random-word');
      if (response.ok) {
        const data: LexiconEntry = await response.json();
        setEntry(data);
      }
    } catch (error) {
      console.error('Failed to fetch word:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  useEffect(() => {
    const interval = setInterval(fetchWord, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchWord]);

  if (loading && !entry) {
    return (
      <div className="mt-8 max-w-md space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-white/5 w-1/2 rounded" />
          <div className="w-4 h-4 bg-white/5 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/5 w-full rounded" />
          <div className="h-4 bg-white/5 w-5/6 rounded" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <div className="mt-8 max-w-md border-l-4 border-white/30 pl-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-white/60"></div>
          <h3 className="text-2xl font-black text-white font-serif tracking-tight uppercase leading-none">
            {entry.word}
          </h3>
        </div>
        <button
          onClick={fetchWord}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/30 hover:border-white/60 transition-colors disabled:opacity-50 group"
          aria-label="Refresh word"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4">
        <p className="text-white/80 font-serif text-base leading-relaxed font-medium border-b border-white/10 pb-4">
          {entry.definition}
        </p>
      </div>
    </div>
  );
};

export default RandomWord;