"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const RandomFAQ: React.FC = () => {
  const [faq, setFaq] = useState<FAQItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFAQ = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/faq');
      if (response.ok) {
        const data: FAQItem = await response.json();
        setFaq(data);
      }
    } catch (error) {
      console.error('Failed to fetch FAQ:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQ();
  }, [fetchFAQ]);

  useEffect(() => {
    const interval = setInterval(fetchFAQ, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchFAQ]);

  if (loading && !faq) {
    return (
      <div className="mt-8 max-w-md space-y-3">
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

  if (!faq) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-400/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-400/40 rounded-l-lg"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <HelpCircle size={16} className="text-white/60" />
            <h3 className="text-lg font-bold text-white/90 font-sans tracking-wide">FAQ</h3>
          </div>
          <button
            onClick={fetchFAQ}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center border border-white/25 hover:border-white/50 transition-colors disabled:opacity-50 group text-white"
            aria-label="Refresh FAQ"
          >
            <RefreshCw size={14} className={`transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="ml-4 pb-6">
          <div className="mb-3">
            <h4 className="text-white/90 font-semibold text-base mb-2 leading-tight">
              {faq.question}
            </h4>
          </div>
          <div className="text-white/80 font-serif text-sm leading-relaxed font-medium border-l-2 border-purple-400/40 pl-4 mb-4">
            {faq.answer}
          </div>
        </div>
        <div className="ml-4 border-t border-white/10 pt-3">
          <Link
            href="/faq"
            className="text-white/50 font-mono text-xs tracking-wider hover:text-white/80 transition-colors flex items-center gap-2 uppercase"
          >
            <span className="w-2 h-2 bg-white/30 rounded-full"></span>
            FAQ
            <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RandomFAQ;