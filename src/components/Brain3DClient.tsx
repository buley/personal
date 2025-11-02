import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
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
  audioData?: { frequency: number; amplitude: number };
}

// Create a simple particle system that forms a brain shape
function BrainParticles({
  activeRegion,
  background = false,
  small = false,
  mousePos,
  location = 'title',
  nodeCount,
  highlightedNodes,
  audioData,
}: Brain3DClientProps & { audioData: { frequency: number; amplitude: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const assemblyCompleteRef = useRef(false);
  const assemblyProgressRef = useRef(0);

  const effectiveNodeCount = useMemo(() => 
    nodeCount && Object.keys(nodeCount).length > 0 ? nodeCount : { default: 64 }, 
    [nodeCount]
  ); // Fallback to 64 nodes if no regions

  // Create random highlights for homepage when no active region
  const randomHighlights = useMemo(() => {
    if (!activeRegion) {
      const highlights: { [region: string]: string[] } = {};
      
      // Highlight 2-3 items from each region for homepage activity
      Object.entries(effectiveNodeCount).forEach(([region, count]) => {
        const numToHighlight = Math.min(3, Math.max(1, Math.floor((count as number) * 0.4))); // 40% of each region, min 1, max 3
        
        // Select random indices from this region
        const availableIndices = Array.from({ length: count as number }, (_, i) => i);
        const shuffled = [...availableIndices].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, numToHighlight);
        
        highlights[region] = selected.map(i => i.toString());
      });
      
      return highlights;
    }
    return {};
  }, [activeRegion, effectiveNodeCount]);

  // Combine manual highlights with random highlights
  const effectiveHighlightedNodes = useMemo(() => {
    // Check if highlightedNodes has any actual highlights (non-empty arrays)
    const hasManualHighlights = highlightedNodes && Object.values(highlightedNodes).some(arr => arr.length > 0);
    if (hasManualHighlights) {
      return highlightedNodes;
    }
    return randomHighlights;
  }, [highlightedNodes, randomHighlights]);

  // Create particle positions that form a brain-like shape with regions
  const particleData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const emissiveColors: THREE.Color[] = [];
    const regions: string[] = [];
    const connections: { start: number; end: number; strength: number }[] = [];

    Object.entries(effectiveNodeCount).forEach(([region, count]) => {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.8 + Math.random() * 0.4;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(new THREE.Vector3(x, y, z));
        regions.push(region);

        const isHighlighted = effectiveHighlightedNodes?.[region]?.includes(`${i}`);
        const isRandomlyLit = false; // Disable random ambient lighting since we now have structured highlights
        
        // Region-specific highlight colors
        const getHighlightColor = (region: string) => {
          switch (region) {
            case 'frontal': return 0x00ffff; // Cyan for identity/frontal
            case 'prefrontal': return 0xff6b6b; // Coral for operation/prefrontal
            case 'limbic': return 0x4ecdc4; // Teal for growth/limbic
            case 'parietal': return 0x45b7d1; // Sky blue for impact/parietal
            case 'temporal': return 0x96ceb4; // Sage green for meta/temporal
            default: return 0x00ffff; // Default cyan
          }
        };

        const getEmissiveColor = (region: string) => {
          switch (region) {
            case 'frontal': return 0x004444; // Dark cyan
            case 'prefrontal': return 0x442222; // Dark coral
            case 'limbic': return 0x1a3a35; // Dark teal
            case 'parietal': return 0x1a3440; // Dark sky blue
            case 'temporal': return 0x2a3a30; // Dark sage
            default: return 0x004444; // Default dark cyan
          }
        };
        
        const color = isHighlighted
          ? new THREE.Color(getHighlightColor(region))
          : isRandomlyLit
          ? new THREE.Color(0x1a1a2e) // Dim dark blue-gray for ambient structure visibility
          : new THREE.Color(0x000000); // Default color - black for stealth mode

        const emissiveColor = isHighlighted
          ? new THREE.Color(getEmissiveColor(region))
          : isRandomlyLit
          ? new THREE.Color(0x0a0a15) // Very subtle ambient glow
          : new THREE.Color(0x000000); // No glow for default

        colors.push(color);
        emissiveColors.push(emissiveColor);
      }
    });

    // Generate neural connections between nearby particles
    const maxDistance = 0.5; // Maximum distance for connections
    const maxConnections = background ? 2 : 3; // Fewer connections for background to reduce performance impact
    
    for (let i = 0; i < positions.length; i++) {
      let connectionCount = 0;
      for (let j = i + 1; j < positions.length && connectionCount < maxConnections; j++) {
        const distance = positions[i].distanceTo(positions[j]);
        if (distance < maxDistance) {
          // Prefer connections within the same region, but allow cross-region connections
          const sameRegion = regions[i] === regions[j];
          const connectionStrength = sameRegion ? 0.8 : 0.3;
          
          connections.push({
            start: i,
            end: j,
            strength: connectionStrength * (1 - distance / maxDistance) // Stronger for closer particles
          });
          connectionCount++;
        }
      }
    }

    return { positions, colors, emissiveColors, regions, connections };
  }, [effectiveNodeCount, effectiveHighlightedNodes, background]);

  // Set up instanced mesh
  React.useEffect(() => {
    if (particlesRef.current && particleData.positions.length > 0) {
      // Create emissive color attribute for glow effect
      const emissiveColorArray = new Float32Array(particleData.positions.length * 3);
      particleData.emissiveColors.forEach((color, i) => {
        emissiveColorArray[i * 3] = color.r;
        emissiveColorArray[i * 3 + 1] = color.g;
        emissiveColorArray[i * 3 + 2] = color.b;
      });
      
      particlesRef.current.geometry.setAttribute('emissiveColor', new THREE.InstancedBufferAttribute(emissiveColorArray, 3));

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
      particlesRef.current.geometry.attributes.emissiveColor.needsUpdate = true;
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
    
    // If there are highlighted nodes, complete assembly immediately for direct article loads
    const hasHighlights = highlightedNodes && Object.values(highlightedNodes).some(arr => arr.length > 0);
    if (hasHighlights && !assemblyCompleteRef.current) {
      assemblyCompleteRef.current = true;
      assemblyProgressRef.current = 1;
    }
  }, [location, highlightedNodes]);

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

  // Store connection line references for animation
  const connectionLines = useRef<THREE.Line[]>([]);

  // Initialize connection lines array when particleData changes
  React.useEffect(() => {
    connectionLines.current = new Array(particleData.connections.length);
  }, [particleData.connections.length]);

  // Create connection lines
  const connectionObjects = useMemo(() => {
    return particleData.connections.map((connection, index) => {
      const startPos = particleData.positions[connection.start];
      const endPos = particleData.positions[connection.end];
      const startRegion = particleData.regions[connection.start];
      const endRegion = particleData.regions[connection.end];
      
      // Use the brighter color of the two regions, or a blend
      const getConnectionColor = () => {
        if (startRegion === endRegion) {
          switch (startRegion) {
            case 'frontal': return 0x00ffff;
            case 'prefrontal': return 0xff6b6b;
            case 'limbic': return 0x4ecdc4;
            case 'parietal': return 0x45b7d1;
            case 'temporal': return 0x96ceb4;
            default: return 0x00ffff;
          }
        } else {
          // Blend colors for cross-region connections
          return 0x666666; // Neutral gray for cross-region
        }
      };
      
      const geometry = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
      const material = new THREE.LineBasicMaterial({
        color: getConnectionColor(),
        opacity: connection.strength * 0.3,
        transparent: true
      });
      
      const line = new THREE.Line(geometry, material);
      connectionLines.current[index] = line;
      return line;
    });
  }, [particleData.connections, particleData.positions, particleData.regions]);

  // Physics forces between particles
  const applyPhysicsForces = (positions: THREE.Vector3[], regions: string[], time: number) => {
    const forces = positions.map(() => new THREE.Vector3());
    
    positions.forEach((pos, i) => {
      positions.forEach((otherPos, j) => {
        if (i === j) return;
        
        const distance = pos.distanceTo(otherPos);
        if (distance > 1.5) return; // Only apply forces within range
        
        const direction = new THREE.Vector3().subVectors(otherPos, pos).normalize();
        let force = 0;
        
        // Attraction between same region particles
        if (regions[i] === regions[j]) {
          force = (1.5 - distance) * 0.001; // Attraction
        } else {
          // Repulsion between different regions
          force = -(1.5 - distance) * 0.0005; // Repulsion
        }
        
        // Add some organic variation
        force += Math.sin(time * 0.5 + i * 0.1) * 0.0002;
        
        forces[i].add(direction.multiplyScalar(force));
      });
    });
    
    return forces;
  };

  // Data flow particles that travel along connections
  const dataPackets = useMemo(() => {
    const packets: { connectionIndex: number; progress: number; speed: number; color: number }[] = [];
    
    // Create data packets for active connections
    particleData.connections.forEach((connection, index) => {
      if (Math.random() < 0.3) { // 30% chance of having a data packet
        packets.push({
          connectionIndex: index,
          progress: Math.random(), // Random starting position
          speed: 0.01 + Math.random() * 0.02, // Random speed
          color: connection.strength > 0.5 ? 0xffffff : 0x888888 // Bright for strong connections
        });
      }
    });
    
    return packets;
  }, [particleData.connections]);

  // Refs for data packet meshes
  const dataPacketRefs = useRef<THREE.Mesh[]>([]);

  // Store initial scattered positions
  const initialPositions = useMemo(() => {
    const particleCount = particleData.positions.length;
    return Array.from({ length: particleCount }, () => 
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
    );
  }, [particleData.positions.length]);

  const prevMousePos = useRef(mousePos);
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const deltaX = mousePos.x - prevMousePos.current.x;
    const deltaY = mousePos.y - prevMousePos.current.y;

    velocity.current = { x: deltaX, y: deltaY };
    prevMousePos.current = mousePos;
  }, [mousePos]);

  useFrame((state) => {
    if (groupRef.current) {
      const speedFactor = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2) * 5; // Adjust multiplier for sensitivity

      const targetRotationY = mousePos.x * Math.PI;
      const targetRotationX = mousePos.y * Math.PI;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1 * speedFactor;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1 * speedFactor;
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
        
        // Apply physics forces after assembly is mostly complete
        let finalPosition = targetPosition.clone();
        if (assemblyProgress > 0.8) {
          const forces = applyPhysicsForces(particleData.positions, particleData.regions, time);
          finalPosition.add(forces[i]);
        }
        
        dummy.position.lerpVectors(initialPosition, finalPosition, assemblyProgress);

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
                activationMultiplier = 1.5; // Increased from 1.3
              }
              break;
            case 'operation':
              if (region === 'prefrontal') {
                activationMultiplier = 1.5;
              }
              break;
            case 'growth':
              if (region === 'limbic') {
                activationMultiplier = 1.5;
              }
              break;
            case 'impact':
              if (region === 'parietal') {
                activationMultiplier = 1.5;
              }
              break;
            case 'meta':
              if (region === 'temporal') {
                activationMultiplier = 1.5;
              }
              break;
          }
        }

        // Audio reactivity - boost activation based on sound
        if (audioData.amplitude > 0.1) {
          // Low frequencies affect frontal regions, high frequencies affect temporal
          const frequencyRatio = Math.min(audioData.frequency / 1000, 1); // Normalize to 0-1
          const regionIndex = ['frontal', 'prefrontal', 'limbic', 'parietal', 'temporal'].indexOf(region);
          
          if (regionIndex >= 0) {
            const regionFrequencyMatch = 1 - Math.abs(frequencyRatio - regionIndex / 4);
            activationMultiplier *= 1 + (audioData.amplitude * regionFrequencyMatch * 0.5);
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

      // Animate neural connections
      connectionLines.current.forEach((line, index) => {
        if (line && line.material instanceof THREE.LineBasicMaterial && particleData.connections[index]) {
          // Create pulsing effect based on time and connection strength
          const pulse = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
          const baseOpacity = particleData.connections[index].strength * 0.3;
          line.material.opacity = baseOpacity + (pulse * baseOpacity * 0.5);
        }
      });

      // Animate data packets
      dataPackets.forEach((packet, index) => {
        packet.progress += packet.speed;
        if (packet.progress > 1) {
          packet.progress = 0; // Loop back to start
        }
        
        const connection = particleData.connections[packet.connectionIndex];
        const startPos = particleData.positions[connection.start];
        const endPos = particleData.positions[connection.end];
        
        // Interpolate position along the connection
        const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, packet.progress);
        
        const mesh = dataPacketRefs.current[index];
        if (mesh) {
          mesh.position.copy(currentPos);
          // Add slight floating motion
          mesh.position.y += Math.sin(time * 5 + index) * 0.02;
        }
      });

      } catch (error) {
        // Silently handle animation errors to prevent crashes
        console.warn('Brain particle animation error:', error);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleData.positions.length]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial />
      </instancedMesh>
      
      {/* Neural Connections */}
      {connectionObjects.map((line, index) => (
        <primitive key={`connection-${index}`} object={line} />
      ))}
      
      {/* Data Flow Packets */}
      {dataPackets.map((packet, index) => (
        <mesh 
          key={`packet-${index}`}
          ref={(ref) => { if (ref) dataPacketRefs.current[index] = ref; }}
        >
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial 
            color={packet.color} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Add point lights for highlighted particles to create glow effect */}
      {(() => {
        const lights: React.ReactElement[] = [];
        let regionStartIndex = 0;
        
        Object.entries(effectiveNodeCount).forEach(([region, count]) => {
          const highlightedIndices = effectiveHighlightedNodes?.[region] || [];
          highlightedIndices.forEach((indexStr) => {
            const localIndex = parseInt(indexStr);
            const globalIndex = regionStartIndex + localIndex;
            if (globalIndex < particleData.positions.length) {
              const position = particleData.positions[globalIndex];
              
              // Get region-specific light color
              const getLightColor = (region: string) => {
                switch (region) {
                  case 'frontal': return 0x00ffff; // Cyan
                  case 'prefrontal': return 0xff6b6b; // Coral
                  case 'limbic': return 0x4ecdc4; // Teal
                  case 'parietal': return 0x45b7d1; // Sky blue
                  case 'temporal': return 0x96ceb4; // Sage green
                  default: return 0x00ffff;
                }
              };
              
              lights.push(
                <pointLight
                  key={`${region}-${localIndex}`}
                  position={[position.x, position.y, position.z]}
                  color={getLightColor(region)}
                  intensity={0.8}
                  distance={2}
                  decay={2}
                />
              );
            }
          });
          regionStartIndex += count as number;
        });
        
        return lights;
      })()}
    </group>
  );
}

interface Brain3DClientProps {
  activeRegion?: string | null | undefined
  background?: boolean;
  small?: boolean;
  location?: 'title' | 'nav' | 'mobile';
  nodeCount?: { [region: string]: number };
  highlightedNodes?: { [region: string]: string[] };
}

  export default function Brain3DClient({ activeRegion, background = false, small = false, location = 'title', nodeCount = {}, highlightedNodes = {} }: Brain3DClientProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // Audio reactivity state
  const [audioData, setAudioData] = useState<{ frequency: number; amplitude: number }>({ frequency: 0, amplitude: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

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
    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement;
      const region = target.getAttribute('data-brain-region') || target.closest('[data-brain-region]')?.getAttribute('data-brain-region');
      if (region) {
        setHoveredRegion(region);
      }
    };

    const handleMouseLeave = (event: Event) => {
      const target = event.target as HTMLElement;
      const relatedTarget = (event as MouseEvent).relatedTarget as HTMLElement;
      
      // Only clear hovered region if we're actually leaving a brain region element
      const isLeavingBrainRegion = target?.hasAttribute('data-brain-region') || target?.closest('[data-brain-region]');
      const isEnteringBrainRegion = relatedTarget?.hasAttribute('data-brain-region') || relatedTarget?.closest('[data-brain-region]');
      
      if (isLeavingBrainRegion && !isEnteringBrainRegion) {
        setHoveredRegion(null);
      }
    };

    // Use event delegation on document body to catch all mouse events
    document.body.addEventListener('mouseenter', handleMouseEnter, true);
    document.body.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.body.removeEventListener('mouseenter', handleMouseEnter, true);
      document.body.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  // Initialize audio context and microphone
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        microphoneRef.current = microphone;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateAudioData = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate average frequency and amplitude
            let sum = 0;
            let maxFreq = 0;
            let maxAmp = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
              if (dataArray[i] > maxAmp) {
                maxAmp = dataArray[i];
                maxFreq = i;
              }
            }
            
            const averageAmplitude = sum / dataArray.length;
            const dominantFrequency = (maxFreq / dataArray.length) * (audioContext.sampleRate / 2);
            
            setAudioData({
              frequency: dominantFrequency,
              amplitude: averageAmplitude / 255 // Normalize to 0-1
            });
          }
          
          animationFrameRef.current = requestAnimationFrame(updateAudioData);
        };
        
        updateAudioData();
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };
    
    // Only initialize audio if not small/background (performance)
    if (!small && !background) {
      initAudio();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [small, background]);

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

        <BrainParticles activeRegion={hoveredRegion || activeRegion} background={background} small={small} mousePos={mousePos} location={location} nodeCount={nodeCount} highlightedNodes={highlightedNodes} audioData={audioData} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!small}
          autoRotateSpeed={background ? 0.3 : 0.5}
          minDistance={2}
          maxDistance={6}
        />

        {/* Post-processing effects for enhanced visuals */}
        {!small && (
          <EffectComposer>
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
            />
            <DepthOfField 
              focusDistance={0.5} 
              focalLength={0.5} 
              bokehScale={2} 
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}