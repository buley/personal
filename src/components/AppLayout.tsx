"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Menu, X } from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import ContentSkeleton from "./ContentSkeleton";
import FunFact from "./FunFact";
import { usePathname, useRouter } from "next/navigation";

const AppLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const mediaUrl = "/api/placeholder/1920/1080";

  const primaryNav = [
    { title: "FAQ", path: "faq" },
    { title: "Contact", path: "contact" },
    { title: "Mantras", path: "mantras" },
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

  // Sync the URL with our state
  useEffect(() => {
    // Remove the leading "/" from the pathname
    const path = pathname.replace(/^\//, "");
    // If the path is empty, clear the state (or set a default landing page)
    setSelectedContent(path || null);
  }, [pathname]);

  // Update the route when a nav item is clicked.
  const handleNavClick = (path: string) => {
    // Push the new route so the URL updates.
    router.push(`/${path}`);
    // Close the mobile menu (state update is optional because our useEffect will sync state from the URL)
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
    <div className="relative min-h-screen bg-black text-white antialiased">
      <div className="fixed inset-0">
        <img
          src={mediaUrl}
          alt="Background"
          className="w-full h-full object-cover opacity-5 transition-opacity duration-1000"
        />
      </div>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden w-8 h-8 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed bottom-8 left-8 z-40">
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
          <div className="pt-4">
            <FunFact />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
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
          <div className="pt-4">
            <FunFact />
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <Suspense fallback={<ContentSkeleton />}>
        {selectedContent ? (
          <main className="relative z-30 min-h-screen px-6 py-8 md:py-12 flex items-center justify-center md:ml-[280px]">
            <div className="w-full max-w-5xl animate-fadeIn px-6 md:px-12">
              <div className="
                prose prose-invert 
                prose-headings:font-sans prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mb-5 prose-h1:font-black
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:font-black
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:font-bold
                prose-h4:text-1xl prose-h4:mb-2 prose-h4:font-bold
                prose-p:font-serif prose-p:font-medium prose-p:text-xl prose-p:leading-loose prose-p:mb-1
                prose-li:font-serif prose-li:font-medium prose-li:text-xl prose-li:leading-loose
                prose-ul:space-y-2 prose-ol:space-y-2
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
