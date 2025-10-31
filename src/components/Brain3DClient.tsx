"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Global storage for assembly progress to persist across component mounts
const assemblyProgressStore = new Map<string, { complete: boolean; progress: number }>();

interface Brain3DClientProps {
  activeRegion?: string | null;
  background?: boolean;
  small?: boolean;
  location?: 'title' | 'nav' | 'mobile';
  nodeCount?: { [region: string]: number };
  highlightedNodes?: { [region: string]: string[] };
  mousePos: { x: number; y: number };
}

// Create a simple particle system that forms a brain shape
function BrainParticles({
  activeRegion,
  background = false,
  small = false,
  mousePos,
  location = 'title',
  nodeCount = {},
  highlightedNodes = {},
}: Brain3DClientProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const assemblyCompleteRef = useRef(false);
  const assemblyProgressRef = useRef(0);

  console.log('nodeCount:', nodeCount);
  console.log('highlightedNodes:', highlightedNodes);

  // Create particle positions that form a brain-like shape with regions
  const particleData = useMemo(() => {
    console.log('Generating particle data with nodeCount:', nodeCount);
    const positions: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const regions: string[] = [];

    Object.entries(nodeCount).forEach(([region, count]) => {
      console.log(`Region: ${region}, Count: ${count}`);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.8 + Math.random() * 0.4;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(new THREE.Vector3(x, y, z));
        regions.push(region);

        const color = highlightedNodes[region]?.includes(`${i}`)
          ? new THREE.Color(0xffff00) // Highlighted color
          : new THREE.Color(0x74b9ff); // Default color

        colors.push(color);
      }
    });

    console.log('Generated positions:', positions.length);
    return { positions, colors, regions };
  }, [nodeCount, highlightedNodes]);

  // Set up instanced mesh
  React.useEffect(() => {
    if (particlesRef.current && particleData.positions.length > 0) {
      const dummy = new THREE.Object3D();

      particleData.positions.forEach((position, i) => {
        dummy.position.copy(position);
        const baseScale = background ? 0.08 : small ? 0.02 : 0.03; // Larger particles for background
        dummy.scale.setScalar(baseScale + Math.random() * baseScale * 0.5);
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
        particlesRef.current!.setColorAt(i, particleData.colors[i]);
      });

      particlesRef.current.instanceMatrix.needsUpdate = true;
      if (particlesRef.current.instanceColor) {
        particlesRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particleData, background, small]);

  // Load assembly state from global store on mount
  React.useEffect(() => {
    const stored = assemblyProgressStore.get(location);
    if (stored) {
      assemblyCompleteRef.current = stored.complete;
      assemblyProgressRef.current = stored.progress;
    } else {
      assemblyCompleteRef.current = false;
      assemblyProgressRef.current = 0;
    }
  }, [location]);

  // Save assembly state to global store when it changes
  React.useEffect(() => {
    const saveState = () => {
      assemblyProgressStore.set(location, {
        complete: assemblyCompleteRef.current,
        progress: assemblyProgressRef.current
      });
    };

    // Save immediately and set up an interval to save periodically
    saveState();
    const interval = setInterval(saveState, 100); // Save every 100ms during assembly

    return () => {
      clearInterval(interval);
      saveState(); // Save on unmount
    };
  }, [location]);

  // Store initial scattered positions
  const initialPositions = useMemo(() => {
    const particleCount = small ? (location === 'nav' ? 50 : 100) : background ? 800 : 500;
    return Array.from({ length: particleCount }, () => 
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
    );
  }, [small, location, background]);

  useFrame((state) => {
    if (groupRef.current) {
      const rotationSpeed = background ? 0.002 : small ? 0.003 : 0.005;
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += background ? 0.001 : small ? 0.0015 : 0.002;

      // Cursor following behavior
      if (mousePos) {
        const mouseX = mousePos.x;
        const mouseY = mousePos.y;
        
        if (small) {
          // Dramatic rotation for small mode
          const targetRotationY = mouseX * 0.6;
          const targetRotationX = mouseY * 0.4;
          groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.15;
          groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.15;
        } else if (background) {
          // Subtle rotation for background mode
          const targetRotationY = mouseX * 0.1;
          const targetRotationX = mouseY * 0.05;
          groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.02;
          groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.01;
        }
      }
    }

    // Animate particles with region-specific activation
    if (particlesRef.current && particleData.positions.length > 0 && particlesRef.current.count === particleData.positions.length) {
      try {
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < particleData.positions.length; i++) {
        const dummy = new THREE.Object3D();
        
        // Get current matrix if particlesRef is available
        if (particlesRef.current) {
          particlesRef.current.getMatrixAt(i, dummy.matrix);
        } else {
          // If particlesRef is null, skip this particle
          continue;
        }
        
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        // Assembly animation: particles start scattered and move to brain positions
        let assemblyProgress = 1; // Default to complete
        if (!assemblyCompleteRef.current) {
          // Use a ref-based progress that persists across re-renders
          assemblyProgressRef.current = Math.min(assemblyProgressRef.current + 0.02, 1);
          assemblyProgress = assemblyProgressRef.current;
          if (assemblyProgress >= 1) {
            assemblyCompleteRef.current = true;
          }
        }
        
        const targetPosition = particleData.positions[i];
        const initialPosition = initialPositions[i];
        
        dummy.position.lerpVectors(initialPosition, targetPosition, assemblyProgress);

        // Subtle floating motion after assembly
        if (assemblyProgress > 0.9) {
          const floatAmplitude = background ? 0.003 : (small ? 0.0015 : 0.002);
          dummy.position.y += Math.sin(time * 1.5 + i * 0.1) * floatAmplitude;
          dummy.position.x += Math.cos(time * 1.2 + i * 0.1) * floatAmplitude * 0.5;
          if (background) {
            dummy.position.z += Math.sin(time * 0.8 + i * 0.15) * floatAmplitude * 0.3; // Add Z movement for background
          }
        }

        // Region-specific activation effects - scale only
        const region = particleData.regions[i];
        let activationMultiplier = 1;

        if (activeRegion) {
          switch (activeRegion) {
            case 'identity':
              if (region === 'frontal') {
                activationMultiplier = 1.3; // Reduced scale difference
              }
              break;
            case 'operation':
              if (region === 'prefrontal') {
                activationMultiplier = 1.3;
              }
              break;
            case 'growth':
              if (region === 'limbic') {
                activationMultiplier = 1.3;
              }
              break;
            case 'impact':
              if (region === 'parietal') {
                activationMultiplier = 1.3;
              }
              break;
            case 'meta':
              if (region === 'temporal') {
                activationMultiplier = 1.3;
              }
              break;
          }
        }

        // Direct scale setting for instant response
        const baseScale = background ? 0.08 : (small ? 0.02 : 0.03);
        const targetScale = baseScale * activationMultiplier;
        dummy.scale.setScalar(targetScale); // Direct setting instead of interpolation

        dummy.updateMatrix();
        if (particlesRef.current) {
          particlesRef.current.setMatrixAt(i, dummy.matrix);
        }

        // Keep base colors - no color transitions
        if (particlesRef.current) {
          particlesRef.current.setColorAt(i, particleData.colors[i]);
        }
      }

      if (particlesRef.current) {
        particlesRef.current.instanceMatrix.needsUpdate = true;
        if (particlesRef.current.instanceColor) {
          particlesRef.current.instanceColor.needsUpdate = true;
        }
      }
      } catch (error) {
        // Silently handle animation errors to prevent crashes
        console.warn('Brain particle animation error:', error);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleData.positions.length]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}

interface Brain3DClientProps {
  activeRegion?: string | null | undefined
  background?: boolean;
  small?: boolean;
  location?: 'title' | 'nav' | 'mobile';
}

export default function Brain3DClient({ activeRegion, background = false, small = false, location = 'title' }: Brain3DClientProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (small || background) {
      const handleMouseMove = (event: MouseEvent) => {
        // Normalize mouse position to -1 to 1 range
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        setMousePos({ x, y });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [small, background]);

  useEffect(() => {
    const navItems = document.querySelectorAll('[data-brain-region]');

    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement;
      const region = target.getAttribute('data-brain-region');
      if (region) {
        setHoveredRegion(region);
      }
    };

    const handleMouseLeave = () => {
      setHoveredRegion(null);
    };

    navItems.forEach((item) => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      navItems.forEach((item) => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const containerStyle = small
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
        position: "absolute" as const,
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
      };

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: small ? (location === 'nav' ? [0, 0, 3] : [0, 0, 2.5]) : background ? [0, 0, 1.8] : [0, 0, 3], fov: small ? (location === 'nav' ? 50 : 60) : background ? 60 : 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        <BrainParticles activeRegion={hoveredRegion || activeRegion} background={background} small={small} mousePos={mousePos} location={location} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!small}
          autoRotateSpeed={background ? 0.3 : 0.5}
          minDistance={2}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}