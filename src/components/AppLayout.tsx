"use client";

/**
 * AppLayout - Core component for brutalist personal website
 * 
 * Design Philosophy:
 * - Stark black/white brutalist aesthetic
 * - Typography-driven with dramatic size contrasts
 * - Geist font family used intentionally:
 *   - Sans for clean, modern body text (light weight)
 *   - Sans Black for commanding headlines
 *   - Mono for mechanical/digital UI elements
 * - Content presented in lightbox style
 * - Navigation anchored bottom-left for visual tension
 * - Full-screen backdrop with minimal opacity
 */
import React, { useState, Suspense } from "react";
import { Menu, X } from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import ContentSkeleton from "./ContentSkeleton";
import FunFact from "./FunFact";

const AppLayout = () => {
  /**
   * State Management
   * - Mobile menu state for overlay navigation
   * - Selected content determines current view
   * - Media URL for background (could be expanded to dynamic content)
   */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const mediaUrl = "/api/placeholder/1920/1080";

  /**
   * Primary Navigation
   * Primary items appear at bottom of nav
   * Separated by subtle border to distinguish from main categories
   */
  const primaryNav = [
    { title: "FAQ", path: "faq" },
    { title: "Contact", path: "contact" },
    { title: "Mantras", path: "mantras" },
    { title: "Manifesto", path: "manifesto" },
  ];

  /**
   * Secondary Navigation
   * Organized into thematic groups for cognitive chunking
   * Each section represents a different aspect of identity
   * Order flows from concrete (identity) to abstract (emotional)
   */
  const secondaryNav = {
    identity: [
      { title: "Who I Am", path: "personality" },
      { title: "How I'm Wired", path: "wired" },
      { title: "At My Best", path: "best" },
      { title: "At My Worst", path: "worst" },
    ],
    growth: [
      { title: "Emotion", path: "emotion" },
      { title: "Anxiety", path: "anxiety" },
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
  };

  /**
   * Navigation Handler
   * Manages both content selection and mobile menu state
   * Single function ensures synchronized state changes
   */
  const handleNavClick = (path: string) => {
    setSelectedContent(path);
    setMobileMenuOpen(false);
  };

  /**
   * Title Retrieval
   * Flattens navigation structure to find current content title
   * Used for both content display and document title
   */
  const getTitle = (path: string) => {
    const allItems = [...Object.values(secondaryNav).flat(), ...primaryNav];
    return allItems.find((item) => item.path === path)?.title || "";
  };

  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      {/* Background Layer
          - Fixed positioning for parallax effect
          - 5% opacity creates depth without distraction
          - Smooth transition for potential media changes */}
      <div className="fixed inset-0">
        <img
          src={mediaUrl}
          alt="Background"
          className="w-full h-full object-cover opacity-5 transition-opacity duration-1000"
        />
      </div>

      {/* Mobile Menu Toggle
          - Fixed position for consistent access
          - Sits above all content (z-50)
          - Transforms between menu and close icons */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden w-8 h-8 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed bottom-8 left-8 z-40">
        {/* Constrain width and enable scrolling/word-wrapping */}
        <div className="max-w-[250px] w-full overflow-auto space-y-8">
        {Object.entries(secondaryNav).map(([group, items]) => (
            <div key={group} className="space-y-2">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {group}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`
                        font-mono text-xs tracking-widest whitespace-normal
                        hover:text-white transition-colors
                        ${selectedContent === item.path ? "text-white" : "text-white/60"}
                      `}
                    >
                      {selectedContent === item.path ? "→ " : ""}
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pt-4 border-t border-white/20">
            {primaryNav.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  font-mono text-xs tracking-widest whitespace-normal block mt-2
                  hover:text-white transition-colors
                  ${selectedContent === item.path ? "text-white" : "text-white/60"}
                `}
              >
                {selectedContent === item.path ? "→ " : ""}
                {item.title}
              </button>
            ))}
          </div>
          {/* Fun Fact Component */}
          <div className="pt-4">
            <FunFact />
          </div>
        </div>
      </nav>


      {/* Mobile Navigation
          - Full-screen overlay maintains focus
          - Smooth slide-up transition
          - Larger touch targets for mobile use
          - Maintains consistent typography with desktop */}
      <nav 
        className={`
          md:hidden fixed inset-0 bg-black z-40 transition-transform duration-300
          ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="h-full overflow-auto p-8 pt-16">
          <div className="space-y-8">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <div key={group} className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  {group}
                </h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`
                          font-mono text-base tracking-widest
                          ${selectedContent === item.path 
                            ? "text-white" 
                            : "text-white/60"
                          }
                        `}
                      >
                        {selectedContent === item.path ? "→ " : ""}
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="pt-6 border-t border-white/20">
              {primaryNav.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    font-mono text-base tracking-widest block mt-4
                    ${selectedContent === item.path 
                      ? "text-white" 
                      : "text-white/60"
                    }
                  `}
                >
                  {selectedContent === item.path ? "→ " : ""}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          {/* Fun Fact Component */}
          <div className="pt-4">
            <FunFact />
          </div>
        </div>
      </nav>

      {/* Content Area with Suspense
          - Suspense boundary outside main prevents layout shifts
          - ContentSkeleton matches exact layout during loading
          - Centered content with generous padding
          - Typography optimized for readability */}
      <Suspense fallback={<ContentSkeleton />}>
      {selectedContent ? (
        <main className="relative z-30 min-h-screen px-6 py-8 md:py-12 flex items-center justify-center md:ml-[280px]">
          <div className="w-full max-w-5xl animate-fadeIn px-6 md:px-12">
          <div className="
            prose prose-invert 
            prose-headings:font-sans prose-headings:tracking-tight
            prose-h1:text-6xl prose-h1:mb-12 prose-h1:font-black
            prose-h2:text-5xl prose-h2:mb-8 prose-h2:font-black
            prose-h3:text-4xl prose-h3:mb-6 prose-h3:font-bold
            prose-h4:text-2xl prose-h4:mb-4 prose-h4:font-bold

            /* Chunkier body text: set paragraphs & list items to serif + heavier weight */
            prose-p:font-serif prose-p:font-medium prose-p:text-xl prose-p:leading-loose prose-p:mb-8
            prose-li:font-serif prose-li:font-medium prose-li:text-xl prose-li:leading-loose

            prose-ul:space-y-3 prose-ol:space-y-3
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-white prose-a:underline hover:prose-a:text-white/80
            prose-blockquote:border-l-4 prose-blockquote:border-white/40 
            prose-blockquote:pl-6 prose-blockquote:text-white/80
            prose-blockquote:text-xl prose-blockquote:font-mono
            prose-hr:border-white/20 prose-hr:my-12
            prose-code:font-mono
            max-w-[38em]
            [&>*]:max-w-[38em]
            space-y-8
            mb-24
          ">
            <MarkdownContent path={selectedContent} />
          </div>

          </div>
        </main>
      ) : (
        <main className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-center justify-center md:ml-[280px]">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Taylor Buley</h2>
            <p className="mt-4 text-white/60 font-mono text-sm tracking-widest">
              Navigate to explore
            </p>
          </div>
        </main>
      )}
    </Suspense>
    </div>
  );
};

export default AppLayout;