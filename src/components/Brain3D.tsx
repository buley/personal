"use client";

import dynamic from 'next/dynamic';

interface Brain3DProps {
  activeRegion?: string | null;
  background?: boolean;
  small?: boolean;
  location?: 'title' | 'nav' | 'mobile';
  muted?: boolean;
  colorScheme?: 'grayscale' | 'default';
  nodeCount?: { [region: string]: number }; // Added nodeCount prop
  highlightedNodes?: { [region: string]: string[] }; // Added highlightedNodes prop
  mousePos?: { x: number; y: number }; // Added mousePos prop
}

// @ts-ignore
const Brain3DClient = dynamic<Brain3DProps>(() => import('./Brain3DClient'), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "transparent" }} />
});

export default function Brain3D({
  activeRegion,
  background = false,
  small = false,
  location = 'title',
  muted = false,
  colorScheme = 'default',
  nodeCount = {},
  highlightedNodes = {},
  mousePos = { x: 0, y: 0 },
}: Brain3DProps) {
  return (
    <Brain3DClient
      activeRegion={activeRegion}
      background={background}
      small={small}
      location={location}
      muted={muted}
      colorScheme={colorScheme}
      nodeCount={nodeCount}
      highlightedNodes={highlightedNodes}
      mousePos={mousePos}
    />
  );
}