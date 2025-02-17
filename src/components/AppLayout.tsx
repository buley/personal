"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import ContentSkeleton from "./ContentSkeleton";
import FunFact from "./FunFact";
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
  });

  // Initialize with a static seed to match the server-rendered HTML.
  const [mediaUrl, setMediaUrl] = useState(`/api/placeholder/1920/1080?seed=static`);

  useEffect(() => {
    // After mount, update the background image URL with a dynamic seed.
    const updateMediaUrl = () => {
      setMediaUrl(`/api/placeholder/1920/1080?seed=${Date.now()}`);
    };

    updateMediaUrl(); // Set the initial dynamic URL after mount.

    // Set up the interval for subsequent updates.
    const interval = setInterval(updateMediaUrl, 10000);
    return () => clearInterval(interval);
  }, []);

  const primaryNav = [
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
      { title: "How I'm Wired", path: "wired" },
      { title: "Interaction Style", path: "interaction-style" },
      { title: "At My Best", path: "best" },
      { title: "At My Worst", path: "worst" },
      { title: "Manifesto", path: "manifesto" },
      { title: "Mantras", path: "mantras" },
    ],
    operation: [
      { title: "Decision Making", path: "decisions" },
      { title: "Time & Energy", path: "time-energy" },
      { title: "Learning", path: "learning" },
      { title: "Crisis Response", path: "crisis" },
      { title: "Competition", path: "competition-collaboration" },
    ],
    growth: [
      { title: "Emotion", path: "emotion" },
      { title: "Anxiety", path: "anxiety" },
      { title: "Stress", path: "stress" },
      { title: "Blind Spots", path: "blind-spots" },
      { title: "Self-Sabotage", path: "self-sabotage" },
      { title: "Challenges", path: "challenges" },
    ],
    impact: [
      { title: "Success", path: "success" },
      { title: "Legacy", path: "legacy" },
      { title: "Execution", path: "execution" },
      { title: "Action", path: "action" },
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

  const handleNavClick = (path: string) => {
    router.push(`/${path}`);
    setMobileMenuOpen(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    <div className={`${isMobile ? "space-y-3" : "space-y-2"}`}>
      <button
        onClick={() => toggleSection(group)}
        className="w-full flex items-center justify-between group"
      >
        <h3
          className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 ${
            isMobile ? "text-base" : ""
          }`}
        >
          {group}
        </h3>
        {expandedSections[group] ? (
          <ChevronDown
            size={12}
            className="text-white/40 group-hover:text-white/60"
          />
        ) : (
          <ChevronRight
            size={12}
            className="text-white/40 group-hover:text-white/60"
          />
        )}
      </button>
      {expandedSections[group] && (
        <ul className={`${isMobile ? "space-y-3 pl-3" : "space-y-1 pl-2"}`}>
          {items.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`font-mono tracking-widest whitespace-normal w-full text-left hover:text-white transition-colors ${
                  selectedContent === item.path
                    ? "text-white"
                    : "text-white/60"
                } ${isMobile ? "text-base" : "text-xs"}`}
              >
                {selectedContent === item.path ? "→ " : ""}
                {item.title}
              </button>
            </li>
          ))}
        </ul>
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
          className="opacity-55 w-full h-full object-cover transition-opacity duration-1000"
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
      <nav className="hidden md:flex fixed left-8 bottom-16 z-40">
        {/* Content */}
        <div className="flex flex-col justify-end max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="max-w-[250px] w-full space-y-4 pr-4">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <NavSection key={group} group={group} items={items} />
            ))}
            <div className="pt-4">
              <hr className="border-white/20 pt-4" />
              <h1 className="pb-4 font-mono text-xs text-center font-bold uppercase tracking-[0.2em] text-white/80">
                <Link href="/">Taylor William Buley</Link>
              </h1>
              <hr className="border-white/20 pt-4" />
            </div>
            <div className="flex flex-row space-x-4 items-center">
              {primaryNav.map((item) => {
                let icon = null;
                if (item.path.startsWith("http")) {
                  icon = <ExternalLink size={14} className="ml-1" />;
                } else if (item.path.startsWith("mailto")) {
                  icon = <Mail size={14} className="ml-1" />;
                } else if (item.path.startsWith("tel")) {
                  icon = <Phone size={14} className="ml-1" />;
                }
                return item.path.startsWith("http") ||
                  item.path.startsWith("mailto") ||
                  item.path.startsWith("tel") ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target={item.path.startsWith("http") ? "_blank" : "_self"}
                    rel={item.path.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-mono text-xs tracking-widest whitespace-nowrap hover:text-white transition-colors text-white/60 hover:text-white flex items-center"
                  >
                    {item.title}{" "}
                    {icon && <span className="inline-flex items-center">{icon}</span>}
                  </a>
                ) : (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`font-mono text-xs tracking-widest whitespace-nowrap hover:text-white transition-colors ${
                      selectedContent === item.path ? "text-white" : "text-white/60"
                    }`}
                  >
                    {selectedContent === item.path ? "→ " : ""}
                    {item.title}
                  </button>
                );
              })}
            </div>
            <div>
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
          <div className="space-y-8">
            {Object.entries(secondaryNav).map(([group, items]) => (
              <NavSection key={group} group={group} items={items} isMobile />
            ))}
            <div className="pt-6 border-t border-white/20">
              {primaryNav.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`font-mono text-base tracking-widest block mt-4 w-full text-left ${
                    selectedContent === item.path
                      ? "text-white"
                      : "text-white/60"
                  }`}
                >
                  {selectedContent === item.path ? "→ " : ""}
                  {item.title}
                </button>
              ))}
            </div>
            <div className="pt-4">
              <hr className="border-white/20 pt-4" />
              <h1 className="pb-4 font-mono text-xs text-center font-bold uppercase tracking-[0.2em] text-white/80">
                <Link href="/">Taylor William Buley</Link>
              </h1>
              <hr className="border-white/20 pt-4" />
            </div>
            <div className="pt-4">
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
          <main className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-bottom justify-center md:ml-[280px]">
            <div className="text-left">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Taylor William Buley
              </h2>
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
