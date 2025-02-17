"use client";
import React, { useState, Suspense } from "react";
import { Menu, X } from "lucide-react";
import MarkdownContent from "./MarkdownContent";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState("/api/placeholder/1920/1080");

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

  // NavButton renders each link in a stark, monospace style.
  const NavButton = ({
    title,
    path,
  }: {
    title: string;
    path: string;
  }) => (
    <button
      onClick={() => {
        setSelectedContent(path);
        setIsMobileMenuOpen(false);
      }}
      className={`
        font-mono text-xs tracking-widest
        ${selectedContent === path ? "font-bold underline" : "font-normal"}
        transition-colors duration-200
      `}
    >
      {title}
    </button>
  );

  // Helper: find the title for the selected content.
  const findTitle = (path: string) => {
    const allItems = [
      ...Object.values(secondaryNav).flat(),
      ...primaryNav,
    ];
    return allItems.find((item) => item.path === path)?.title || "";
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Media */}
      <div className="fixed inset-0 z-0">
        <img
          src={mediaUrl}
          alt="Background"
          className="object-cover w-full h-full opacity-10"
        />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-8 right-8 z-50 md:hidden focus:outline-none"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation */}
      <nav
        className={`
          fixed z-40 
          ${
            isMobileMenuOpen
              ? "inset-0 bg-black p-8 flex flex-col space-y-12"
              : "hidden md:flex flex-col bottom-8 left-8"
          }
          transition-all duration-300
        `}
      >
        <div className="flex flex-col space-y-8">
          {Object.entries(secondaryNav).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                {group}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.path}>
                    <NavButton title={item.title} path={item.path} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white">
          {primaryNav.map((item) => (
            <div key={item.path} className="mt-2">
              <NavButton title={item.title} path={item.path} />
            </div>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <main className="relative z-30 min-h-screen p-8 md:p-16 lg:p-24 flex items-center">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4 max-w-3xl">
              <div className="h-12 bg-white w-96"></div>
              <div className="h-4 bg-white w-full"></div>
              <div className="h-4 bg-white w-5/6"></div>
            </div>
          }
        >
          {selectedContent && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-bold mb-12 tracking-tight">
                {findTitle(selectedContent)}
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
