import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTES } from '../../lib/model/palettes'
import { useSnapStore } from '../../lib/storage/store'

/**
 * Ambient 3D backdrop for the hero: thin paper sheets and a folded leaf
 * drifting in soft daylight, tilting gently toward the pointer.
 * Lazy-loaded (default export) so three.js stays out of the first paint.
 */

function PaperSheet({
  position,
  rotation,
  tint,
  speed,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  tint: string
  speed: number
}) {
  return (
    <Float
      speed={speed}
      rotationIntensity={0.35}
      floatIntensity={0.7}
      floatingRange={[-0.15, 0.15]}
    >
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[1.6, 2.2, 0.015]} />
        <meshStandardMaterial color={tint} roughness={0.85} metalness={0} />
      </mesh>
    </Float>
  )
}

function FoldedLeaf({ accent }: { accent: string }) {
  const geometry = useMemo(() => {
    // A leaf as two gently folded triangles.
    const shape = new THREE.Shape()
    shape.moveTo(0, -0.9)
    shape.quadraticCurveTo(0.62, -0.25, 0, 1)
    shape.quadraticCurveTo(-0.62, -0.25, 0, -0.9)
    return new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false })
  }, [])
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <mesh geometry={geometry} position={[1.6, -0.4, 0.6]} rotation={[0.3, -0.5, 0.4]}>
        <meshStandardMaterial color={accent} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  )
}

function Scene({ accent }: { accent: string }) {
  const palette = PALETTES[useSnapStore((s) => s.settings.defaultAccent)]
  const group = useRef<THREE.Group>(null)

  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y += (pointer.x * 0.22 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-pointer.y * 0.14 - group.current.rotation.x) * 0.04
  })

  const sheets: { p: [number, number, number]; r: [number, number, number]; s: number }[] = [
    { p: [-1.9, 0.5, -1.2], r: [0.1, 0.5, -0.12], s: 1.1 },
    { p: [0.4, 1.1, -2.2], r: [-0.15, -0.35, 0.1], s: 0.8 },
    { p: [-0.4, -1.2, -1.6], r: [0.2, 0.25, 0.18], s: 1.3 },
    { p: [2.1, 0.9, -2.8], r: [-0.1, 0.55, -0.2], s: 0.9 },
  ]

  return (
    <group ref={group}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fffdf5" />
      {sheets.map((sheet, i) => (
        <PaperSheet
          key={i}
          position={sheet.p}
          rotation={sheet.r}
          tint={i % 2 === 0 ? '#ffffff' : palette.bg}
          speed={sheet.s}
        />
      ))}
      <FoldedLeaf accent={accent} />
    </group>
  )
}

export default function Hero3D() {
  const accent = PALETTES[useSnapStore((s) => s.settings.defaultAccent)].accent
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <Scene accent={accent} />
    </Canvas>
  )
}
