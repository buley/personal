"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, FileText, ExternalLink } from 'lucide-react';
import { marked } from 'marked';
import Link from 'next/link';

interface Fragment {
  title: string;
  content: string;
  source: string;
}

const RandomFragment: React.FC = () => {
  const [fragment, setFragment] = useState<Fragment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFragment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/random-fragment');
      if (response.ok) {
        const data: Fragment = await response.json();
        setFragment(data);
      }
    } catch (error) {
      console.error('Failed to fetch fragment:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFragment();
  }, [fetchFragment]);

  useEffect(() => {
    const interval = setInterval(fetchFragment, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchFragment]);

  if (loading && !fragment) {
    return (
      <div className="mt-8 max-w-md space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-white/5 w-3/4 rounded" />
          <div className="w-4 h-4 bg-white/5 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/5 w-full rounded" />
          <div className="h-4 bg-white/5 w-11/12 rounded" />
          <div className="h-4 bg-white/5 w-4/5 rounded" />
        </div>
        <div className="flex justify-end">
          <div className="h-3 bg-white/5 w-1/4 rounded" />
        </div>
      </div>
    );
  }

  if (!fragment) {
    return null;
  }

  const renderedContent = marked(fragment.content, { breaks: true });

  return (
    <div className="relative bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-white/60" />
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">{fragment.title}</h3>
        </div>
        <button
          onClick={fetchFragment}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors disabled:opacity-50 group"
          aria-label="Refresh fragment"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4 mb-4">
        <div 
          className="text-white/70 font-serif text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
      <div className="ml-4 border-t border-white/10 pt-3">
        <Link 
          href={`/${fragment.source}`}
          className="text-white/50 font-mono text-xs tracking-wider hover:text-white/80 transition-colors flex items-center gap-2 uppercase"
        >
          <span className="w-2 h-2 bg-white/30 rounded-full"></span>
          {fragment.source}
          <ExternalLink size={10} />
        </Link>
      </div>
      </div>
    </div>
  );
};

export default RandomFragment;