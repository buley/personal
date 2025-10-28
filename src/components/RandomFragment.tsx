"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
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
    <div className="mt-8 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-bold text-white/80">{fragment.title}</h3>
        <button
          onClick={fetchFragment}
          disabled={loading}
          className="text-white/40 hover:text-white/60 transition-colors disabled:opacity-50"
          aria-label="Refresh fragment"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div 
        className="text-white/60 font-serif text-sm leading-relaxed mb-2 prose prose-invert prose-sm"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
      <Link 
        href={`/${fragment.source}`}
        className="float-right text-white/40 font-mono text-xs tracking-widest hover:text-white/60 transition-colors flex items-center gap-1"
      >
        {fragment.source}
        <ExternalLink size={12} />
      </Link>
    </div>
  );
};

export default RandomFragment;