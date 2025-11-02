"use client";

import React, { useState, useEffect, Suspense, useMemo, useRef } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Home,
  HelpCircle,
} from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import ContentSkeleton from "./ContentSkeleton";
import FunFact from "./FunFact";
import RandomFragment from "./RandomFragment";
import RandomWord from "./RandomWord";
import RandomAdvice from "./RandomAdvice";
import RandomModel from "./RandomModel";
import RandomMantra from "./RandomMantra";
import RandomFAQ from "./RandomFAQ";
import Brain3D from "./Brain3D";
import { usePathname, useRouter } from "next/navigation";

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
  const [activeBrainRegion, setActiveBrainRegion] = useState<string | null>(null);
  const [activeItemPath, setActiveItemPath] = useState<string | null>(null);
  const [navVisible, setNavVisible] = useState(false);

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

  const secondaryNav: SecondaryNavType = useMemo(() => ({
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
      { title: "Resilience & Recovery", path: "resiliance" },
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
  }), []);

  // Create a mapping of subnav items to brain regions for individual hover effects
  const subnavItemMapping = useMemo(() => {
    const mapping: { [key: string]: string } = {};
    
    // Identity items -> frontal lobe
    secondaryNav.identity.forEach(item => {
      mapping[item.path] = 'frontal';
    });
    
    // Operation items -> prefrontal cortex
    secondaryNav.operation.forEach(item => {
      mapping[item.path] = 'prefrontal';
    });
    
    // Growth items -> limbic system
    secondaryNav.growth.forEach(item => {
      mapping[item.path] = 'limbic';
    });
    
    // Impact items -> parietal lobes
    secondaryNav.impact.forEach(item => {
      mapping[item.path] = 'parietal';
    });
    
    // Meta items -> temporal lobes
    secondaryNav.meta.forEach(item => {
      mapping[item.path] = 'temporal';
    });
    
    return mapping;
  }, [secondaryNav]);  // Sync the URL with our state.
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

    // Set active brain region for selected content
    const group = getGroupFromPath(selectedContent);
    if (group) {
      setActiveBrainRegion(group);
      setActiveItemPath(selectedContent);
    } else {
      setActiveBrainRegion(null);
      setActiveItemPath(null);
    }
  }, [selectedContent, secondaryNav]);

  // Handle scroll to show/hide navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setNavVisible(scrollY > 100); // Show nav after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string | null) => {
    if (path === null) {
      router.push("/");
    } else {
      router.push(`/${path}`);
    }
    setMobileMenuOpen(false);
  };

  const handleNavHover = (group: string | null, itemPath?: string) => {
    console.log('handleNavHover called:', { group, itemPath });
    setActiveBrainRegion(group);
    setActiveItemPath(itemPath || null);
  };

  const handleNavLeave = (event?: React.MouseEvent) => {
    if (event?.relatedTarget instanceof Element && event.relatedTarget.closest('[data-nav-item]')) {
      return;
    }
    setActiveBrainRegion(null);
    setActiveItemPath(null);
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
    <div 
      className={`${isMobile ? "space-y-3" : "space-y-2"} border-b border-white/8 pb-3`}
      onMouseEnter={() => handleNavHover(group)}
      onMouseLeave={handleNavLeave}
    >
      <button
        data-nav-item
        onClick={() => toggleSection(group)}
        className="w-full flex items-center justify-between group py-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/35">⬣</span>
          <h3
            className={`font-sans font-bold uppercase tracking-wide text-white/65 group-hover:text-white/85 transition-colors ${
              isMobile ? "text-base" : "text-sm"
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
        <div className={`${isMobile ? "space-y-2 ml-5" : "space-y-1 ml-3"} pl-3`}>
          {items.map((item) => (
            <li key={item.path} className="list-none">
              <button
                data-nav-item
                onClick={() => handleNavClick(item.path)}
                onMouseEnter={() => handleNavHover(group, item.path)}
                onMouseLeave={handleNavLeave}
                className={`w-full text-left py-1 px-2 transition-all duration-200 relative ${
                  selectedContent === item.path
                    ? "text-white bg-white/5 border-l-1 border-white/60 pl-4"
                    : "text-white/55 hover:text-white/80 hover:bg-white/2 hover:border-l-2 hover:border-white/30 hover:pl-3"
                } ${isMobile ? "text-sm" : "text-sm"} font-medium tracking-wide`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </div>
      )}
    </div>
  );

  const mapGroupToRegion = (group: string) => {
    switch (group) {
      case 'identity': return 'frontal';
      case 'operation': return 'prefrontal';
      case 'growth': return 'limbic';
      case 'impact': return 'parietal';
      case 'meta': return 'temporal';
      default: return 'default';
    }
  };

  const getGroupFromPath = (path: string | null) => {
    if (!path) return null;
    for (const group in secondaryNav) {
      if (secondaryNav[group].some(item => item.path === path)) {
        return group;
      }
    }
    return null;
  };

  const nodeCounts = useMemo(() => {
    const counts: { [region: string]: number } = {
      frontal: secondaryNav.identity.length,
      prefrontal: secondaryNav.operation.length,
      limbic: secondaryNav.growth.length,
      parietal: secondaryNav.impact.length,
      temporal: secondaryNav.meta.length,
    };
    return counts;
  }, [secondaryNav]);

  const highlightedNodes = useMemo(() => {
    const highlights: { [region: string]: string[] } = {
      frontal: [],
      prefrontal: [],
      limbic: [],
      parietal: [],
      temporal: [],
    };

    if (activeBrainRegion) {
      const region = mapGroupToRegion(activeBrainRegion);
      if (activeItemPath) {
        // Highlight specific item
        const items = secondaryNav[activeBrainRegion];
        const index = items.findIndex(item => item.path === activeItemPath);
        if (index !== -1) {
          highlights[region] = [index.toString()];
        }
      } else {
        // Highlight all in the region
        const count = nodeCounts[region];
        highlights[region] = Array.from({ length: count }, (_, i) => i.toString());
      }
    }

    return highlights;
  }, [activeBrainRegion, activeItemPath, nodeCounts, secondaryNav]);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
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

      {/* Background Brain3D */}
      <div className="fixed inset-0 z-0">
        <Brain3D 
          activeRegion={activeBrainRegion} 
          background={true} 
          location="nav" 
          muted={true} 
          colorScheme="grayscale" 
          nodeCount={nodeCounts} 
          highlightedNodes={highlightedNodes} 
        />
      </div>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden w-8 h-8 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation - Top Bar (when scrolled) */}
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--foreground)]/10 transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex items-center justify-between w-full px-8 py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="font-sans font-black text-foreground/85 uppercase tracking-wider text-lg">
              <button 
                onClick={() => handleNavClick(null)}
                className="hover:text-foreground transition-colors"
              >
                Taylor Buley
              </button>
            </h1>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center space-x-8">
            {/* Secondary Nav Sections */}
            {Object.entries(secondaryNav).map(([group, items]) => (
              <div key={group} className="relative group">
                <button 
                  data-brain-region={mapGroupToRegion(group)}
                  onMouseEnter={() => handleNavHover(group)}
                  onMouseLeave={handleNavLeave}
                  className="w-24 text-center text-foreground-muted hover:text-foreground transition-colors font-medium capitalize"
                >
                  {group}
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-gradient-to-br from-[var(--accent)] to-transparent border border-foreground rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.path}
                        data-brain-region={mapGroupToRegion(group)}
                        onMouseEnter={() => handleNavHover(group, item.path)}
                        onMouseLeave={handleNavLeave}
                        onClick={() => handleNavClick(item.path)}
                        className="block w-full text-left text-foreground-muted hover:text-foreground hover:bg-[var(--accent)] px-3 py-2 rounded transition-colors text-sm"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Primary Nav */}
            <div className="flex items-center space-x-4 border-l border-white/20 pl-8">
              {primaryNav.slice(0, 2).map((item) => {
                const isSelected = selectedContent === item.path || (item.path === null && selectedContent === null);
                const Icon = item.path === null ? Home :
                  item.path === "faq" ? HelpCircle :
                  item.path && item.path.startsWith("mailto") ? Mail :
                  item.path && item.path.startsWith("tel") ? Phone :
                  item.path && item.path.startsWith("http") ? ExternalLink :
                  null;
                return item.path && (item.path.startsWith("http") ||
                  item.path.startsWith("mailto") ||
                  item.path.startsWith("tel")) ? (
                  <a
                    key={item.path || item.title}
                    href={item.path || "#"}
                    className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {Icon && <Icon size={16} />}
                    <span className="text-sm font-medium">{item.title}</span>
                  </a>
                ) : (
                  <button
                    key={item.path || item.title}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-2 transition-colors text-sm font-medium ${
                      isSelected ? "text-white" : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.title}</span>
                  </button>
                );
              })}
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
        {/* Mobile Brain Background */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-0">
            <Brain3D activeRegion={activeBrainRegion} background={true} location="mobile" nodeCount={nodeCounts} highlightedNodes={highlightedNodes} />
          </div>
        )}
        <div className="h-full overflow-auto p-8 pt-16 custom-scrollbar relative z-10">
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
                <button 
                  onClick={() => handleNavClick("about")}
                  className="hover:text-white transition-colors"
                >
                  Taylor William Buley
                </button>
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
                const Icon = item.path === null ? Home :
                  item.path === "faq" ? HelpCircle :
                  item.path && item.path.startsWith("mailto") ? Mail :
                  item.path && item.path.startsWith("tel") ? Phone :
                  item.path && item.path.startsWith("http") ? ExternalLink :
                  null;
                const isExternal = item.path && (item.path.startsWith("http") || item.path.startsWith("mailto") || item.path.startsWith("tel"));
                const commonClasses = `w-full py-3 px-4 border transition-colors font-medium tracking-wide text-center flex items-center justify-center gap-2 ${
                  isSelected
                    ? "text-white border-white/60 bg-white/5"
                    : "text-white/60 border-white/20 hover:text-white hover:border-white/40"
                }`;
                if (isExternal) {
                  return (
                    <a
                      key={item.path || item.title}
                      href={item.path}
                      target={item.path.startsWith("http") ? "_blank" : "_self"}
                      rel={item.path.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={commonClasses}
                    >
                      {Icon && <Icon size={18} />}
                      {item.title}
                    </a>
                  );
                } else {
                  return (
                    <button
                      key={item.path || item.title}
                      onClick={() => handleNavClick(item.path)}
                      className={commonClasses}
                    >
                      {Icon && <Icon size={18} />}
                      {item.title}
                    </button>
                  );
                }
              })}
            </div>
            <div className="pt-6">
              <FunFact />
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation - Old Sidebar (when not scrolled) */}
      {!navVisible && (
        <nav className="hidden md:flex fixed left-8 bottom-8 z-40">
          <div className="max-w-[260px] w-64 relative">
            {/* Content */}
            <div className="flex flex-col max-h-[70vh] overflow-y-auto custom-scrollbar relative z-10">
              <div className="max-w-[260px] w-full space-y-3 pr-4 pl-3 py-4 border-l border-white/15 bg-black/20 backdrop-blur-sm">
                {Object.entries(secondaryNav).map(([group, items]) => (
                  <NavSection key={group} group={group} items={items} />
                ))}
                <div className="pt-4 border-t border-white/15">
                  <div className="flex items-center justify-center py-2">
                    <div className="w-6 h-px bg-white/25"></div>
                    <div className="mx-2 w-1.5 h-1.5 bg-white/35 rounded-full"></div>
                    <div className="w-6 h-px bg-white/25"></div>
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <h1 className="text-center font-sans font-black text-white/85 uppercase tracking-wider text-sm">
                      <button 
                        onClick={() => handleNavClick("about")}
                        className="hover:text-white transition-colors"
                      >
                        Who is Taylor?
                      </button>
                    </h1>
                  </div>
                </div>
                <div className="space-y-1">
                  {primaryNav.slice(0, 2).map((item) => {
                    const isSelected = selectedContent === item.path || (item.path === null && selectedContent === null);
                    const Icon = item.path === null ? Home :
                      item.path === "faq" ? HelpCircle :
                      item.path && item.path.startsWith("mailto") ? Mail :
                      item.path && item.path.startsWith("tel") ? Phone :
                      item.path && item.path.startsWith("http") ? ExternalLink :
                      null;
                    return item.path && (item.path.startsWith("http") ||
                      item.path.startsWith("mailto") ||
                      item.path.startsWith("tel")) ? (
                      <a
                        key={item.path || item.title}
                        href={item.path || "#"}
                        className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-white/5 w-full"
                      >
                        {Icon && <Icon size={14} />}
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <button
                        key={item.path || item.title}
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center gap-2 transition-colors text-sm font-medium px-2 py-1 rounded w-full text-left ${
                          isSelected ? "text-white/80 bg-white/5" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        }`}
                      >
                        {Icon && <Icon size={14} />}
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Desktop Navigation - Top Bar (when scrolled) */}
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex items-center justify-between w-full px-8 py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="font-sans font-black text-white/85 uppercase tracking-wider text-lg">
              <button 
                onClick={() => handleNavClick(null)}
                className="hover:text-white transition-colors"
              >
                <img src="icon.png" alt="Taylor Buley" className="inline-block ml-2 w-6 h-6 object-contain" />
              </button>
            </h1>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center space-x-8">
            {/* Secondary Nav Sections */}
            {Object.entries(secondaryNav).map(([group, items]) => (
              <div key={group} className="relative group">
                <button className="w-24 text-center text-white/70 hover:text-white transition-colors font-medium capitalize">
                  {group}
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className="block w-full text-left text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors text-sm"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Primary Nav */}
            <div className="flex items-center space-x-4 border-l border-white/20 pl-8">
              {primaryNav.slice(0, 2).map((item) => {
                const isSelected = selectedContent === item.path || (item.path === null && selectedContent === null);
                const Icon = item.path === null ? Home :
                  item.path === "faq" ? HelpCircle :
                  item.path && item.path.startsWith("mailto") ? Mail :
                  item.path && item.path.startsWith("tel") ? Phone :
                  item.path && item.path.startsWith("http") ? ExternalLink :
                  null;
                return item.path && (item.path.startsWith("http") ||
                  item.path.startsWith("mailto") ||
                  item.path.startsWith("tel")) ? (
                  <a
                    key={item.path || item.title}
                    href={item.path || "#"}
                    className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {Icon && <Icon size={16} />}
                    <span className="text-sm font-medium">{item.title}</span>
                  </a>
                ) : (
                  <button
                    key={item.path || item.title}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-2 transition-colors text-sm font-medium ${
                      isSelected ? "text-white" : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.title}</span>
                  </button>
                );
              })}
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
        {/* Mobile Brain Background */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-0">
            <Brain3D activeRegion={activeBrainRegion} background={true} location="mobile" nodeCount={nodeCounts} highlightedNodes={highlightedNodes} />
          </div>
        )}
        <div className="h-full overflow-auto p-8 pt-16 custom-scrollbar relative z-10">
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
                <button 
                  onClick={() => handleNavClick("about")}
                  className="hover:text-white transition-colors"
                >
                  Taylor William Buley
                </button>
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
                const Icon = item.path === null ? Home :
                  item.path === "faq" ? HelpCircle :
                  item.path && item.path.startsWith("mailto") ? Mail :
                  item.path && item.path.startsWith("tel") ? Phone :
                  item.path && item.path.startsWith("http") ? ExternalLink :
                  null;
                const isExternal = item.path && (item.path.startsWith("http") || item.path.startsWith("mailto") || item.path.startsWith("tel"));
                const commonClasses = `w-full py-3 px-4 border transition-colors font-medium tracking-wide text-center flex items-center justify-center gap-2 ${
                  isSelected
                    ? "text-white border-white/60 bg-white/5"
                    : "text-white/60 border-white/20 hover:text-white hover:border-white/40"
                }`;
                if (isExternal) {
                  return (
                    <a
                      key={item.path || item.title}
                      href={item.path}
                      target={item.path.startsWith("http") ? "_blank" : "_self"}
                      rel={item.path.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={commonClasses}
                    >
                      {Icon && <Icon size={18} />}
                      {item.title}
                    </a>
                  );
                } else {
                  return (
                    <button
                      key={item.path || item.title}
                      onClick={() => handleNavClick(item.path)}
                      className={commonClasses}
                    >
                      {Icon && <Icon size={18} />}
                      {item.title}
                    </button>
                  );
                }
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
          <main className={`relative z-30 min-h-screen px-6 py-8 md:py-12 flex items-center justify-center transition-all duration-300 ${
            navVisible ? 'pt-24' : 'pt-8 md:pt-12 md:ml-[280px]'
          }`}>
            <div className="w-full max-w-5xl animate-fadeIn px-6 md:px-12">
              <div
                className={`
                  prose prose-invert content-container
                  prose-headings:font-sans prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:font-black prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mb-5 prose-h2:font-black prose-h2:leading-tight
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:font-bold prose-h3:leading-snug
                  prose-h4:text-xl prose-h4:mb-3 prose-h4:font-bold prose-h4:leading-snug
                  prose-p:font-serif prose-p:font-medium prose-p:text-xl prose-p:leading-relaxed prose-p:mb-2 prose-p:tracking-wide
                  prose-li:font-serif prose-li:font-medium prose-li:text-xl prose-li:leading-relaxed prose-li:tracking-wide
                  prose-ul:space-y-3 prose-ol:space-y-3
                  prose-strong:text-white prose-strong:font-bold
                  prose-a:text-white prose-a:underline hover:prose-a:text-white/80
                  prose-blockquote:border-l-4 prose-blockquote:border-white/40 
                  prose-blockquote:pl-6 prose-blockquote:text-white/80
                  prose-blockquote:text-3xl prose-blockquote:leading-relaxed prose-blockquote:tracking-wide
                  prose-hr:border-white/20 prose-hr:my-12
                  prose-code:font-mono
                  max-w-[42em]
                  [&>*]:max-w-[42em]
                  space-y-8 mb-24
                `}
              >
                <MarkdownContent path={selectedContent} />
              </div>
            </div>
          </main>
        ) : (
          <main className={`relative z-30 min-h-screen px-6 py-8 md:py-16 flex items-start justify-center pt-24 transition-all duration-300 ${
            !navVisible ? 'md:ml-[280px]' : ''
          }`}>
            <div className="w-full max-w-7xl">
              <div className="text-center mb-16 md:mb-12 space-y-3">
                <div className="flex items-center justify-center gap-6 mb-2">
                  <div className="w-16 h-16 md:w-24 md:h-24 p-2">
                    <a href="/" dangerouslySetInnerHTML={{ __html: '<img src="/icon.png" alt="Header Icon" class="w-full h-full object-cover rounded-full" />' }} />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-left">
                      <button
                        onClick={() => handleNavClick("about")}
                        className="hover:text-white/80 transition-colors reenie-beanie"
                      >
                        Taylor William Buley
                      </button>
                    </h2>
                    <p className="text-white/60 font-mono text-3xl md:text-2xl tracking-widest reenie-beanie text-center">
                      Cognitive Architect
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                {/* Widgets overlay */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto bg-dark p-6 rounded-lg shadow-md text-black">
                  <div className="col-span-1">
                    <RandomFragment />
                  </div>
                  <div className="col-span-1 flex flex-col gap-4">
                    <RandomMantra />
                    <RandomModel />
                  </div>
                  <div className="col-span-1 flex flex-col gap-4">
                    <RandomAdvice />
                    <RandomWord />
                    <RandomFAQ />
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </Suspense>
    </div>
  );
};

export default AppLayout;
