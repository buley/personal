"use client";
import React, { useState, Suspense } from "react";
import { Menu, X } from "lucide-react";
import MarkdownContent from "./MarkdownContent";

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const mediaUrl = "/api/placeholder/1920/1080";

  // Navigation structure
  const primaryNav = [
    { title: "FAQ", path: "faq" },
    { title: "Contact", path: "contact" },
    { title: "Manifesto", path: "manifesto" },
  ];

  const secondaryNav = {
    identity: [
      { title: "Who I Am", path: "personality" },
      { title: "How I'm Wired", path: "wired" },
      { title: "At My Best", path: "best" },
      { title: "At My Worst", path: "worst" },
    ],
    growth: [
      { title: "Blind Spots", path: "blind-spots" },
      { title: "Self-Sabotage", path: "self-sabotage" },
      { title: "Challenges", path: "challenges" },
    ],
    mindset: [
      { title: "Success", path: "success" },
      { title: "Legacy", path: "legacy" },
      { title: "Execution", path: "execution" },
      { title: "Action", path: "action" },
    ],
    emotional: [
      { title: "Anxiety", path: "anxiety" },
      { title: "Emotion", path: "emotion" },
      { title: "Mantras", path: "mantras" },
    ],
  };

  const handleNavClick = (path: string) => {
    setSelectedContent(path);
    setMobileMenuOpen(false);
  };

  const getTitle = (path: string) => {
    const allItems = [
      ...Object.values(secondaryNav).flat(),
      ...primaryNav,
    ];
    return allItems.find((item) => item.path === path)?.title || "";
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Media */}
      <div className="absolute inset-0">
        <img
          src={mediaUrl}
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden focus:outline-none"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation - Bottom Left */}
      <nav className="hidden md:block fixed bottom-4 left-4 z-40">
        <div className="space-y-6">
          {Object.entries(secondaryNav).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest">
                {group}
              </h3>
              <ul className="space-y-1 mt-1">
                {items.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`font-mono text-xs tracking-widest ${
                        selectedContent === item.path ? "underline font-bold" : ""
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="border-t border-white pt-2">
            {primaryNav.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`font-mono text-xs tracking-widest block ${
                  selectedContent === item.path ? "underline font-bold" : ""
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <nav className="md:hidden fixed inset-0 bg-black p-8 z-40 overflow-y-auto">
          <div className="space-y-8">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                  {group}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`font-mono text-base tracking-widest ${
                          selectedContent === item.path ? "underline font-bold" : ""
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-white pt-4">
              {primaryNav.map((item) => (
                <div key={item.path} className="mt-2">
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`font-mono text-base tracking-widest ${
                      selectedContent === item.path ? "underline font-bold" : ""
                    }`}
                  >
                    {item.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Content Area */}
      <main className="relative z-30 flex items-center justify-center min-h-screen px-8 py-16">
        <Suspense fallback={<div className="text-white">Loading…</div>}>
          {selectedContent ? (
            <div className="max-w-3xl w-full bg-black p-8 border border-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                {getTitle(selectedContent)}
              </h1>
              <MarkdownContent path={selectedContent} />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-bold">Select a Section</h2>
              <p className="mt-4">Use the navigation to explore content.</p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AppLayout;
