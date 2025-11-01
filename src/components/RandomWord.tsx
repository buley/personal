"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Type, ExternalLink } from 'lucide-react';
import { marked } from 'marked';
import Link from 'next/link';

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
    const interval = setInterval(fetchWord, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchWord]);

  if (loading && !entry) {
    return (
      <div className="mt-8 max-w-md space-y-3 mb-4">
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

  const renderedDefinition = marked(entry.definition, { breaks: true });

  return (
    <div className="relative bg-gradient-to-br from-red-500/5 to-transparent border border-red-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Type size={16} className="text-white/60" />
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">
            {entry.word}
          </h3>
        </div>
        <button
          onClick={fetchWord}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group text-white"
          aria-label="Refresh word"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4">
        <div 
          className="text-white/80 font-serif text-base leading-relaxed font-medium border-b border-white/10 pb-4 prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedDefinition }}
        />
      </div>
      <div className="ml-4 border-t border-white/10 pt-3">
        <Link 
          href="/lexicon"
          className="text-white/50 font-mono text-xs tracking-wider hover:text-white/80 transition-colors flex items-center gap-2 uppercase"
        >
          <span className="w-2 h-2 bg-white/30 rounded-full"></span>
          Lexicon
          <ExternalLink size={10} />
        </Link>
      </div>
      </div>
    </div>
  );
};

export default RandomWord;