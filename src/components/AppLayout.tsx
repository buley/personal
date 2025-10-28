"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Home,
} from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import ContentSkeleton from "./ContentSkeleton";
import FunFact from "./FunFact";
import RandomFragment from "./RandomFragment";
import RandomWord from "./RandomWord";
import RandomAdvice from "./RandomAdvice";
import RandomModel from "./RandomModel";
import RandomMantra from "./RandomMantra";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const AppLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    identity: false,
    operation: false,
    growth: false,
    impact: false,
    meta: true,
  });

  // Initialize with a static seed to match the server-rendered HTML.
  const [mediaUrl, setMediaUrl] = useState(`/api/placeholder/1920/1080?seed=static`);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // After mount, update the background image URL with a dynamic seed.
    const updateMediaUrl = () => {
      setMediaUrl(`/api/placeholder/1920/1080?seed=${Date.now()}`);
    };

    updateMediaUrl(); // Set the initial dynamic URL after mount.

    // Set up the interval for subsequent updates.
    const interval = setInterval(updateMediaUrl, 300000);
    return () => clearInterval(interval);
  }, []);

  // Reset loaded state when URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [mediaUrl]);

  const primaryNav = [
    { title: "Home", path: null },
    { title: "FAQ", path: "faq" },
    { title: "Email", path: "mailto:buley@outlook.com?subject=website" },
    { title: "Text", path: "tel:16503537653" },
    { title: "CV", path: "https://buley.info/" },
  ];

  type SecondaryNavType = {
    [key: string]: { title: string; path: string }[];
  };

  const secondaryNav: SecondaryNavType = {
    identity: [
      { title: "Who I Am", path: "personality" },
      { title: "At My Best", path: "best" },
      { title: "At My Worst", path: "worst" },
      { title: "How I'm Wired", path: "wired" },
      { title: "Interaction Style", path: "interaction-style" },
      { title: "Values & Ethics", path: "values" },
      { title: "Archetypes & Personas", path: "archetypes" },
      { title: "Philosophy", path: "philosophy" },
      { title: "Manifesto", path: "manifesto" },
      { title: "Mantras", path: "mantras" },
    ],

    operation: [
      { title: "Attention", path: "adhd" },
      { title: "AuADHD", path: "auadhd" },
      { title: "Autism", path: "autism" },
      { title: "Strategy", path: "strategy" },
      { title: "Decision Making", path: "decisions" },
      { title: "Communication Protocols", path: "communication" },
      { title: "Conflict & Negotiation", path: "conflict" },
      { title: "Competition & Collaboration", path: "competition-collaboration" },
      { title: "Crisis Response", path: "crisis" },
      { title: "Learning", path: "learning" },
      { title: "System Design", path: "systems" },
      { title: "Cognitive Architecture", path: "cognitive-architecture" },
      { title: "Time & Energy", path: "time-energy" },
      { title: "Advice", path: "advice" },
      { title: "Biases", path: "biases" },
      { title: "Vulnerability", path: "vulnerability" },
      { title: "Counter-Vulnerability", path: "counter-vulnerability" },
    ],

    growth: [
      { title: "Challenges", path: "challenges" },
      { title: "Blind Spots", path: "blind-spots" },
      { title: "Anxiety", path: "anxiety" },
      { title: "Emotion", path: "emotion" },
      { title: "Stress", path: "stress" },
      { title: "Self-Sabotage", path: "self-sabotage" },
      { title: "Resilience & Recovery", path: "resilience" },
      { title: "Reinvention", path: "reinvention" },
      { title: "Reflection & Self-Audit", path: "reflection" },
    ],

    impact: [
      { title: "Action", path: "action" },
      { title: "Execution", path: "execution" },
      { title: "Leadership", path: "leadership" },
      { title: "Influence & Persuasion", path: "influence" },
      { title: "Politics", path: "politics" },
      { title: "Legacy", path: "legacy" },
      { title: "Success", path: "success" },
    ],

    meta: [
      { title: "Operating Manual", path: "manual" },
      { title: "Lexicon", path: "lexicon" },
      { title: "Mental Models", path: "models" },
    ],
  };

  // Sync the URL with our state.
  useEffect(() => {
    const path = pathname.replace(/^\//, "");
    setSelectedContent(path || null);
  }, [pathname]);

  // Open the parent section when selected content changes.
  useEffect(() => {
    const newExpanded: { [key: string]: boolean } = {};
    for (const group in secondaryNav) {
      newExpanded[group] = secondaryNav[group].some(
        (item) => item.path === selectedContent
      );
    }
    setExpandedSections(newExpanded);
  }, [selectedContent]);

  const handleNavClick = (path: string | null) => {
    if (path === null) {
      router.push("/");
    } else {
      router.push(`/${path}`);
    }
    setMobileMenuOpen(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[section];
      if (isCurrentlyExpanded) {
        // If closing, just close this one
        return {
          ...prev,
          [section]: false,
        };
      } else {
        // If opening, close all others and open this one
        const newExpanded = Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === section;
          return acc;
        }, {} as { [key: string]: boolean });
        return newExpanded;
      }
    });
  };

  // Navigation Section Component
  const NavSection = ({
    group,
    items,
    isMobile = false,
  }: {
    group: string;
    items: Array<{ title: string; path: string }>;
    isMobile?: boolean;
  }) => (
    <div className={`${isMobile ? "space-y-3" : "space-y-2"} border-b border-white/8 pb-3`}>
      <button
        onClick={() => toggleSection(group)}
        className="w-full flex items-center justify-between group py-1"
      >
        <div className="flex items-center gap-2">
          <div className={`w-1 h-3 bg-white/35 transition-all duration-300 ${expandedSections[group] ? 'h-4' : ''}`}></div>
          <h3
            className={`font-sans font-bold uppercase tracking-wide text-white/65 group-hover:text-white/85 transition-colors ${
              isMobile ? "text-base" : "text-xs"
            }`}
          >
            {group}
          </h3>
        </div>
        <div className={`w-5 h-5 border border-white/25 group-hover:border-white/40 transition-colors flex items-center justify-center ${expandedSections[group] ? 'rotate-180' : ''}`}>
          <ChevronDown
            size={10}
            className="text-white/45 group-hover:text-white/65 transition-colors"
          />
        </div>
      </button>
      {expandedSections[group] && (
        <div className={`${isMobile ? "space-y-2 ml-5" : "space-y-1 ml-3"} border-l border-white/8 pl-3`}>
          {items.map((item) => (
            <li key={item.path} className="list-none">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left py-1 px-2 border-l-2 transition-all duration-200 ${
                  selectedContent === item.path
                    ? "text-white border-white/70 bg-white/3"
                    : "text-white/55 border-transparent hover:text-white/80 hover:border-white/25"
                } ${isMobile ? "text-sm" : "text-xs"} font-medium tracking-wide`}
              >
                {selectedContent === item.path && (
                  <span className="inline-block w-1 h-1 bg-white/80 rounded-full mr-2"></span>
                )}
                {item.title}
              </button>
            </li>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
      `}</style>

      {/* Background Image */}
      <div className="fixed inset-0">
        <img
          key={mediaUrl}
          src={mediaUrl}
          alt="Background"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-55' : 'opacity-0'
          }`}
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
      <nav className="hidden md:flex fixed left-8 top-16 z-40">
        {/* Content */}
        <div className="flex flex-col max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
          <div className="max-w-[260px] w-full space-y-3 pr-4 pl-3 py-4 border-l border-white/15">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <NavSection key={group} group={group} items={items} />
            ))}
            <div className="pt-4 border-t border-white/15">
              <div className="flex items-center justify-center py-2">
                <div className="w-6 h-px bg-white/25"></div>
                <div className="mx-2 w-1.5 h-1.5 bg-white/35 rounded-full"></div>
                <div className="w-6 h-px bg-white/25"></div>
              </div>
              <h1 className="text-center font-sans font-black text-white/85 uppercase tracking-wider text-sm mb-2">
                <Link href="/about" className="hover:text-white transition-colors">
                  Taylor William Buley
                </Link>
              </h1>
              <div className="flex items-center justify-center py-2">
                <div className="w-6 h-px bg-white/25"></div>
                <div className="mx-2 w-1.5 h-1.5 bg-white/35 rounded-full"></div>
                <div className="w-6 h-px bg-white/25"></div>
              </div>
            </div>
            <div className="space-y-2">
              {primaryNav.map((item) => {
                const isSelected = selectedContent === item.path || (item.path === null && selectedContent === null);
                let icon = null;
                if (item.path && item.path.startsWith("http")) {
                  icon = <ExternalLink size={12} className="ml-1" />;
                } else if (item.path && item.path.startsWith("mailto")) {
                  icon = <Mail size={12} className="ml-1" />;
                } else if (item.path && item.path.startsWith("tel")) {
                  icon = <Phone size={12} className="ml-1" />;
                }
                return item.path && (item.path.startsWith("http") ||
                  item.path.startsWith("mailto") ||
                  item.path.startsWith("tel")) ? (
                  <a
                    key={item.path || item.title}
                    href={item.path}
                    target={item.path.startsWith("http") ? "_blank" : "_self"}
                    rel={item.path.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-center w-full py-1.5 px-3 border border-white/15 hover:border-white/30 transition-colors text-white/55 hover:text-white font-medium tracking-wide text-xs"
                  >
                    {item.title}
                    {icon && <span className="inline-flex items-center">{icon}</span>}
                  </a>
                ) : (
                  <button
                    key={item.path || item.title}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full py-1.5 px-3 border transition-colors font-medium tracking-wide text-xs ${
                      isSelected
                        ? "text-white border-white/50 bg-white/3"
                        : "text-white/55 border-white/15 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
            <div className="pt-6">
              <FunFact />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden fixed inset-0 bg-black z-40 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="h-full overflow-auto p-8 pt-16 custom-scrollbar">
          <div className="space-y-6 border border-white/10 rounded-lg p-6 bg-white/5 backdrop-blur-sm">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <NavSection key={group} group={group} items={items} isMobile />
            ))}
            <div className="pt-6 border-t border-white/20">
              <div className="flex items-center justify-center py-4">
                <div className="w-12 h-px bg-white/30"></div>
                <div className="mx-4 w-3 h-3 bg-white/40 rounded-full"></div>
                <div className="w-12 h-px bg-white/30"></div>
              </div>
              <h1 className="text-center font-sans font-black text-white/90 uppercase tracking-wider text-xl mb-4">
                <Link href="/about" className="hover:text-white transition-colors">
                  Taylor William Buley
                </Link>
              </h1>
              <div className="flex items-center justify-center py-4">
                <div className="w-12 h-px bg-white/30"></div>
                <div className="mx-4 w-3 h-3 bg-white/40 rounded-full"></div>
                <div className="w-12 h-px bg-white/30"></div>
              </div>
            </div>
            <div className="space-y-4">
              {primaryNav.map((item) => {
                const isSelected = selectedContent === item.path || (item.path === null && selectedContent === null);
                return (
                  <button
                    key={item.path || item.title}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full py-3 px-4 border transition-colors font-medium tracking-wide text-center ${
                      isSelected
                        ? "text-white border-white/60 bg-white/5"
                        : "text-white/60 border-white/20 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {item.path === null ? <Home size={18} /> : item.title}
                  </button>
                );
              })}
            </div>
            <div className="pt-6">
              <FunFact />
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <Suspense fallback={<ContentSkeleton />}>
        {selectedContent ? (
          <main className="relative z-30 min-h-screen px-6 py-8 md:py-12 flex items-center justify-center md:ml-[280px]">
            <div className="w-full max-w-5xl animate-fadeIn px-6 md:px-12">
              <div
                className={`
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
                  space-y-8 mb-24
                `}
              >
                <MarkdownContent path={selectedContent} />
              </div>
            </div>
          </main>
        ) : (
          <main className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-start justify-center md:ml-[280px]">
            <div className="w-full max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                  Taylor William Buley
                </h2>
                <p className="text-white/60 font-mono text-sm tracking-widest">
                  Systematic problem-solver
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                <RandomFragment />
                <RandomWord />
                <RandomAdvice />
                <RandomModel />
                <RandomMantra />
              </div>
            </div>
          </main>
        )}
      </Suspense>
    </div>
  );
};

export default AppLayout;
