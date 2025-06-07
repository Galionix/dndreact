'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'
import React, { useRef } from 'react'
import { useHistoryStore } from '@/store/history'

function FloatingMagic() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.002
      }
    })

    const particles = Array.from({ length: 30 }, () => {
      // Распределяем частицы ближе к краям прямоугольника
      const edge = Math.floor(Math.random() * 4)
      let x = 0, y = 0, z = 0

      const offset = 2.4
      switch (edge) {
        case 0: // верх
          x = Math.random() * 4 - 2
          y = offset
          break
        case 1: // низ
          x = Math.random() * 4 - 2
          y = -offset
          break
        case 2: // лево
          x = -offset
          y = Math.random() * 2 - 1
          break
        case 3: // право
          x = offset
          y = Math.random() * 2 - 1
          break
      }

      z = Math.random() * 1.5 - 0.75

      return {
        position: [x, y, z],
        scale: 0.05 + Math.random() * 0.1
      }
    })

    return (
      <group ref={groupRef}>
        {particles.map((p, i) => (
          <Sphere key={i} args={[1, 8, 8]} position={p.position} scale={p.scale}>
            <meshStandardMaterial emissive="#5c5cfa" emissiveIntensity={1.2} color="#5c5cfa" transparent opacity={0.8} />
          </Sphere>
        ))}
      </group>
    )
  }


export default function MagicSceneBehindImage() {
    const historyStorage = useHistoryStore()

    return (
      <div className="relative w-[100px] h-[100px] max-w-xl mx-auto">
        {/* Картинка на фоне */}
        <img
          src={historyStorage.charAvatar}
          alt="Magic"
          className="absolute inset-0 w-[100px] h-[100px] object-cover rounded-full shadow-xl z-10"
        />

        {/* Three.js эффекты поверх */}
        <Canvas
          className="absolute inset-0 rounded-xl z-20 pointer-events-none"
          style={{ background: 'transparent' }}
          camera={{ position: [0, 0, 6] }}
          gl={{ alpha: true }}
        >
          {/* <fog attach="fog" args={['#000', 5, 15]} /> */}
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 2, 5]} intensity={1.5} />
          {/* <Stars radius={6} depth={10} count={500} factor={1.5} fade /> */}
          <FloatingMagic />
        </Canvas>

        {/* Лёгкое затемнение сверху */}
        {/* <div className="absolute inset-0 z-30 pointer-events-none rounded-xl bg-gradient-to-br from-transparent via-black/10 to-black/20" /> */}
      </div>
    )
  }
