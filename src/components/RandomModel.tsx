"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Brain, ExternalLink } from 'lucide-react';
import { marked } from 'marked';

interface Model {
  title: string;
  subtitle: string;
  description: string;
  application: string;
}

const RandomModel: React.FC = () => {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchModel = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/random-model');
      if (response.ok) {
        const data: Model = await response.json();
        setModel(data);
      }
    } catch (error) {
      console.error('Failed to fetch model:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  useEffect(() => {
    const interval = setInterval(fetchModel, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchModel]);

  if (loading && !model) {
    return (
      <div className="mt-8 max-w-md space-y-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-white/5 w-3/4 rounded" />
          <div className="w-4 h-4 bg-white/5 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/5 w-full rounded" />
          <div className="h-4 bg-white/5 w-5/6 rounded" />
          <div className="h-4 bg-white/5 w-4/5 rounded" />
        </div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  const renderedDescription = marked(model.description, { breaks: true });
  const renderedApplication = marked(model.application, { breaks: true });

  return (
    <div className="relative bg-gradient-to-br from-green-500/5 to-transparent border border-green-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-green-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Brain size={16} className="text-white/60" />
          <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">Mental Model</h3>
        </div>
        <button
          onClick={fetchModel}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group text-white"
          aria-label="Refresh model"
        >
          <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="ml-4 pb-6">
        <h4 className="text-xl font-black text-white font-serif mb-2">{model.title}</h4>
        <p className="text-white/70 font-serif text-sm italic mb-4">{model.subtitle}</p>
        <div className="space-y-3">
          <div>
            <h5 className="text-white/80 font-bold text-sm uppercase tracking-wide mb-1">Description</h5>
            <div 
              className="text-white/70 font-serif text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedDescription }}
            />
          </div>
          <div>
            <h5 className="text-white/80 font-bold text-sm uppercase tracking-wide mb-1">Application</h5>
            <div 
              className="text-white/70 font-serif text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedApplication }}
            />
          </div>
        </div>
      </div>
      <div className="ml-4 border-t border-white/10 pt-3">
        <Link 
          href="/models"
          className="text-white/50 font-mono text-xs tracking-wider hover:text-white/80 transition-colors flex items-center gap-2 uppercase"
        >
          <span className="w-2 h-2 bg-white/30 rounded-full"></span>
          Models
          <ExternalLink size={10} />
        </Link>
      </div>
      </div>
    </div>
  );
};

export default RandomModel;