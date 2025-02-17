"use client";
import React, { useState, Suspense } from "react";
import { Menu, X } from "lucide-react";
import MarkdownContent from "./MarkdownContent";

/**
 * AppLayout - Main component for the brutalist-style personal website
 * 
 * Design Philosophy:
 * - Stark, minimalist aesthetic with strong typography
 * - Navigation anchored to bottom-left (desktop) for visual tension
 * - Pure black/white color scheme with opacity for depth
 * - Content presented in lightbox style
 * - German modernist/Bauhaus-inspired typography
 */
const AppLayout = () => {
  // State for mobile menu visibility and current content selection
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  
  // Placeholder background - could be replaced with video/dynamic media
  const mediaUrl = "/api/placeholder/1920/1080";

  // Primary navigation - footer-style items
  // These are separated from secondary nav to create hierarchy
  const primaryNav = [
    { title: "FAQ", path: "faq" },
    { title: "Contact", path: "contact" },
    { title: "Manifesto", path: "manifesto" },
  ];

  // Secondary navigation - grouped by theme
  // Groups create cognitive chunking and improve scanability
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

  /**
   * Handles navigation item clicks
   * - Updates selected content
   * - Closes mobile menu if open
   * @param path - The content path to load
   */
  const handleNavClick = (path: string) => {
    setSelectedContent(path);
    setMobileMenuOpen(false);
  };

  /**
   * Retrieves the display title for a given path
   * - Combines both nav arrays to search for title
   * - Returns empty string if not found (shouldn't happen)
   */
  const getTitle = (path: string) => {
    const allItems = [...Object.values(secondaryNav).flat(), ...primaryNav];
    return allItems.find((item) => item.path === path)?.title || "";
  };

  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      {/* Background Media Layer
          - Fixed positioning creates parallax-like effect
          - Low opacity (5%) adds depth without distraction
          - Transition for smooth media changes */}
      <div className="fixed inset-0">
        <img
          src={mediaUrl}
          alt="Background"
          className="w-full h-full object-cover opacity-5 transition-opacity duration-1000"
        />
      </div>

      {/* Mobile Menu Toggle
          - Fixed positioning keeps it accessible
          - Higher z-index ensures clickability
          - Sized for easy touch targets */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden w-8 h-8 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation
          - Hidden on mobile (md:block)
          - Bottom-left positioning creates visual tension
          - Generous spacing improves readability */}
      <nav className="hidden md:block fixed bottom-8 left-8 z-40">
        <div className="space-y-8">
          {/* Secondary Navigation Groups
              - Mapped from secondaryNav object
              - Each group has its own header and items
              - Spacing creates clear group separation */}
          {Object.entries(secondaryNav).map(([group, items]) => (
            <div key={group} className="space-y-2">
              {/* Group Header
                  - Small caps for modernist feel
                  - Low opacity creates hierarchy
                  - Extra tracking for emphasis */}
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {group}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.path}>
                    {/* Navigation Item
                        - Monospace font continues modernist theme
                        - Hover and active states for interactivity
                        - Arrow indicator for current selection */}
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`
                        font-mono text-xs tracking-widest hover:text-white transition-colors
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

          {/* Primary Navigation
              - Separated by subtle border
              - Maintains consistent styling
              - Slightly different spacing for distinction */}
          <div className="pt-4 border-t border-white/20">
            {primaryNav.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  font-mono text-xs tracking-widest block mt-2 hover:text-white transition-colors
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
      </nav>

      {/* Mobile Navigation
          - Full screen overlay
          - Slide-up animation
          - Scrollable for tall content */}
      <nav 
        className={`
          md:hidden fixed inset-0 bg-black z-40 transition-transform duration-300
          ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="h-full overflow-auto p-8 pt-16">
          <div className="space-y-8">
            {/* Mobile Secondary Navigation
                - Larger text for touch targets
                - Maintains consistent styling
                - Adjusted spacing for touch */}
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

            {/* Mobile Primary Navigation
                - Consistent with desktop styling
                - Adjusted spacing for mobile context */}
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
        </div>
      </nav>

      {/* Content Area
          - Centered in viewport
          - Responsive padding
          - Maximum width for readability */}
      <main className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-center justify-center">
        {/* Loading State
            - Simple spinning indicator
            - Maintains minimalist aesthetic */}
        <Suspense 
          fallback={
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          }
        >
          {selectedContent ? (
            // Content Display
            <div className="w-full max-w-3xl transition-opacity duration-300">
              {/* Content Title
                  - Large, bold typography
                  - Tight tracking for impact
                  - Generous bottom margin */}
              <h1 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">
                {getTitle(selectedContent)}
              </h1>
              {/* Content Body
                  - Uses Tailwind prose for markdown styling
                  - Increased size for readability
                  - No maximum width constraint */}
              <div className="prose prose-invert prose-lg max-w-none">
                <MarkdownContent path={selectedContent} />
              </div>
            </div>
          ) : (
            // Initial State
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Identity</h2>
              <p className="mt-4 text-white/60 font-mono text-sm tracking-widest">
                Navigate to explore
              </p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AppLayout;