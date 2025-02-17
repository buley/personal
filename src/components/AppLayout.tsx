"use client";

import React, { useState, Suspense } from 'react';
import { Menu, X, Instagram } from 'lucide-react';

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState('/api/placeholder/1920/1080');

  // Navigation structure
  const primaryNav = [
    { title: 'FAQ', path: 'faq' },
    { title: 'Contact', path: 'contact' },
    { title: 'Manifesto', path: 'manifesto' }
  ];

  const secondaryNav = {
    identity: [
      { title: 'Who I Am', path: 'personality' },
      { title: 'How I\'m Wired', path: 'wired' },
      { title: 'At My Best', path: 'best' },
      { title: 'At My Worst', path: 'worst' }
    ],
    growth: [
      { title: 'Blind Spots', path: 'blind-spots' },
      { title: 'Self-Sabotage', path: 'self-sabotage' },
      { title: 'Challenges', path: 'challenges' }
    ],
    mindset: [
      { title: 'Success', path: 'success' },
      { title: 'Legacy', path: 'legacy' },
      { title: 'Execution', path: 'execution' },
      { title: 'Action', path: 'action' }
    ],
    emotional: [
      { title: 'Anxiety', path: 'anxiety' },
      { title: 'Emotion', path: 'emotion' },
      { title: 'Mantras', path: 'mantras' }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Media */}
      <div className="fixed inset-0 z-0">
        <img 
          src={mediaUrl} 
          alt="Background" 
          className="object-cover w-full h-full opacity-20"
        />
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Menu */}
      <nav className={`
        fixed bottom-0 left-0 z-40
        ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        transition-transform duration-300
        w-full md:w-64 
        bg-black/90 md:bg-black/70
        p-6
        font-mono
      `}>
        {/* Secondary Navigation */}
        <div className="mb-8 space-y-6">
          {Object.entries(secondaryNav).map(([group, items]) => (
            <div key={group} className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider opacity-50">{group}</h3>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item.path}>
                    <button 
                      onClick={() => setSelectedContent(item.path)}
                      className="text-sm hover:text-gray-300 transition-colors"
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Primary Navigation */}
        <div className="border-t border-white/20 pt-4">
          <ul className="space-y-2">
            {primaryNav.map(item => (
              <li key={item.path}>
                <button 
                  onClick={() => setSelectedContent(item.path)}
                  className="text-sm font-bold hover:text-gray-300 transition-colors"
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content Area */}
      <main className="relative z-30 min-h-screen md:pl-72 p-6">
        <Suspense fallback={<div>Loading...</div>}>
          {selectedContent && (
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-6">
                {Object.values(secondaryNav)
                  .flat()
                  .concat(primaryNav)
                  .find(item => item.path === selectedContent)?.title}
              </h1>
              {/* Content will be loaded here */}
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AppLayout;