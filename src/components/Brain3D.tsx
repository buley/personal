"use client";

import dynamic from 'next/dynamic';

interface Brain3DProps {
  activeRegion?: string | null;
  background?: boolean;
  small?: boolean;
  location?: 'title' | 'nav';
}

export default function Brain3D({ activeRegion, background = false, small = false, location = 'title' }: Brain3DProps) {
  const Brain3DClient = dynamic(() => import('./Brain3DClient'), {
    ssr: false,
    loading: () => (
      <div
        style={small
          ? {
              width: location === 'nav' ? "80px" : "120px",
              height: location === 'nav' ? "80px" : "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
            }
          : background
          ? {
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
            }
          : {
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
            }}
      />
    ),
  });

  return <Brain3DClient activeRegion={activeRegion} background={background} small={small} location={location} />;
}