"use client";

import dynamic from 'next/dynamic';
import Brain3DClient from './Brain3DClient';

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

// Removed dynamic import, using direct import instead
// @ts-ignore
// const Brain3DClient = dynamic<Brain3DProps>(() => import('./Brain3DClient'), {
//   ssr: false,
//   loading: () => <div style={{ width: "100%", height: "100%", background: "transparent" }} />
// });

export default function Brain3D({
  activeRegion,
  background = false,
  small = false,
  location = 'title',
  muted = false,
  colorScheme = 'default',
  nodeCount,
  highlightedNodes,
  mousePos = { x: 0, y: 0 },
}: Brain3DProps) {
  // Removed debugging logs

  return (
    <Brain3DClient
      activeRegion={activeRegion}
      background={background}
      small={small}
      location={location}
      nodeCount={nodeCount}
      highlightedNodes={highlightedNodes}
      mousePos={mousePos}
    />
  );
}