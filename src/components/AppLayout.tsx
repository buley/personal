"use client";
import React, { useState, Suspense } from 'react';
import { Menu, X } from 'lucide-react';
import MarkdownContent from './MarkdownContent';

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

  const NavButton = ({ title, path }: { title: string; path: string }) => (
    <button 
      onClick={() => {
        setSelectedContent(path);
        setIsMobileMenuOpen(false);
      }}
      className={`
        font-mono text-xs tracking
        ${selectedContent === path ? 
          'text-white font-bold' : 
          'text-white/50 hover:text-white'
        }
        transition-colors
      `}
    >
      {title}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Media */}
      <div className="fixed inset-0 z-0">
        <img 
          src={mediaUrl} 
          alt="Background" 
          className="object-cover w-full h-full opacity-5"
        />
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-8 right-8 z-50 md:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation */}
      <nav className={`
        fixed z-40 
        md:bottom-8 md:left-8
        ${isMobileMenuOpen ? 
          'inset-0 bg-black/95' : 
          'bottom-0 -translate-y-full md:translate-y-0'
        }
        transition-all duration-300
        md:w-64
        md:bg-transparent
        ${isMobileMenuOpen ? 'p-8' : 'md:p-0'}
      `}>
        <div className="h-full md:h-auto flex flex-col justify-end space-y-12">
          {/* Secondary Nav */}
          <div className="space-y-8">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <div key={group} className="space-y-2">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-white/30">
                  {group}
                </h3>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item.path}>
                      <NavButton title={item.title} path={item.path} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Primary Nav */}
          <div className="space-y-1">
            {primaryNav.map(item => (
              <div key={item.path}>
                <NavButton title={item.title} path={item.path} />
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="relative z-30 min-h-screen p-8 md:p-16 lg:p-24">
        <Suspense fallback={
          <div className="animate-pulse space-y-4 max-w-3xl">
            <div className="h-12 bg-white/5 w-96"></div>
            <div className="h-4 bg-white/5 w-full"></div>
            <div className="h-4 bg-white/5 w-5/6"></div>
          </div>
        }>
          {selectedContent && (
            <div className="max-w-3xl ml-auto">
              <h1 className="text-5xl lg:text-6xl font-bold mb-12 tracking-tight">
                {Object.values(secondaryNav)
                  .flat()
                  .concat(primaryNav)
                  .find(item => item.path === selectedContent)?.title}
              </h1>
              <MarkdownContent path={selectedContent} />
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AppLayout;