"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { EffectComposer, useAfterimage } from '@react-three/postprocessing'
// import { AfterimagePass } from 'postprocessing'
import { Trail } from "@react-three/drei";
const trailsColor = "#6e4de8";

import { useRef, useMemo } from "react";

// export function MagicOrbitSwarm({ count = 30, baseRadius = 1 }) {
//   const refs = useRef<THREE.Mesh[]>([]);

//   const particles = useMemo(() => {
//     const data = [];
//     for (let i = 0; i < count; i++) {
//       const baseAngle = (i / count) * Math.PI * 2;
//       data.push({
//         baseAngle,
//         speed: 0.5 + Math.random() * 0.05,
//         radiusOffset: Math.random() * 0.3,
//         verticalOffset: Math.random() * 0.2,
//         size: 0.01 + Math.random() * 0.005,
//         intensity: 0.1 + Math.random() * 1.5,
//       });
//     }
//     return data;
//   }, [count]);

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();
//     particles.forEach((p, i) => {
//       const angle = p.baseAngle + t * p.speed;
//       const radius =
//         baseRadius + Math.sin(t + p.baseAngle * 3) * p.radiusOffset;
//       const x = Math.cos(angle) * radius;
//       const y = Math.sin(angle) * radius;
//       const z = Math.sin(t * 3 + p.baseAngle) * p.verticalOffset;

//       refs.current[i].position.set(x, y, z);
//     });
//   });

//   return (
//     <>
//       {particles.map((p, i) => (
//         <Trail
//           key={i}
//           width={p.intensity * 5}
//           length={p.intensity * 3}
//           color={`rgba(110, 77, 232, ${p.intensity})`} // RGBA цвет
//           attenuation={(t) => t * t * 0.08}
//           // 110, 77, 232
//         >
//           <mesh ref={(el) => (refs.current[i] = el!)}>
//             <sphereGeometry args={[p.size, 8, 8]} />
//             <meshStandardMaterial
//               color={trailsColor}
//               emissive={trailsColor}
//               emissiveIntensity={p.intensity}
//             />
//           </mesh>
//         </Trail>
//       ))}
//     </>
//   );
// }
export function MagicOrbitBurst({
  baseRadius = 0.8,
  count = 40,
  color = "#1148a7",
  duration = 2.5,
}) {
  const refs = useRef<THREE.Mesh[]>([]);
  const [startTime] = useState(() => performance.now());

  const particles = useMemo(() => {
    const now = performance.now();
    const data = [];
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      data.push({
        baseAngle,
        speed: 0.4 + Math.random() * 0.2,
        radiusOffset: Math.random() * 0.2,
        verticalOffset: Math.random() * 0.1,
        size: 0.015 + Math.random() * 0.01,
        born: now + Math.random() * 500, // случайная задержка старта
        life: duration * 1000 + Math.random() * 500, // индивидуальная продолжительность
      });
    }
    return data;
  }, [count, duration]);

  useFrame((state) => {
    const now = performance.now();
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;

      const age = now - p.born;
      if (age < 0 || age > p.life) {
        mesh.visible = false;
        return;
      }

      const progress = 1 - age / p.life; // от 1 до 0
      mesh.visible = true;
      const angle = p.baseAngle + t * p.speed;
      const radius =
        baseRadius + Math.sin(t * 2 + p.baseAngle * 3) * p.radiusOffset;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.sin(t * 3 + p.baseAngle) * p.verticalOffset;

      mesh.position.set(x, y, z);
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = progress;
    });
  });

  return (
    <>
      {particles.map((p, i) => (
        <mesh ref={(el) => (refs.current[i] = el!)} key={i} visible={false}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function PortalSphere() {
  return (
    <mesh>
      {/* <sphereGeometry args={[1.5, 64, 64]} /> */}
      {/* <meshBasicMaterial color="black" /> */}
      <meshBasicMaterial transparent opacity={0} />
      <Html center>
        <div style={{ width: "400px" }}>
          <img
            src="/logo_transp.png"
            alt="logo"
            className="animate-pulse brightness-110"
          />
        </div>
      </Html>
    </mesh>
  );
}

export default function LogoPortal({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            // backgroundColor: "red",
            zIndex: 5,
          }}
        >
          <Canvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            gl={{ alpha: true }}
            camera={{ position: [0, 0, 5], fov: 50 }}
          >
            <ambientLight intensity={0.5} />
            {/* <directionalLight  /> */}
            {/* <Stars /> */}
            <PortalSphere />
            <MagicOrbitBurst />

            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 px-4 py-2  bg-opacity-20 text-white rounded"
            >
              Закрыть
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
