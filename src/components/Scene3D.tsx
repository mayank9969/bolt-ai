import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Icosahedron, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function FloatingCard({ position, rotation, color, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    ref.current.rotation.x = rotation[0] + Math.cos(state.clock.elapsedTime * 0.2) * 0.1
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={ref} position={position} scale={scale}>
        <RoundedBox args={[1.6, 1.0, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} transparent opacity={0.85} />
        </RoundedBox>
        {/* Question mark symbol */}
        <mesh position={[0, 0, 0.06]}>
          <torusGeometry args={[0.18, 0.04, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial color="#f5d061" metalness={0.9} roughness={0.15} emissive="#f5d061" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.2, 0.06]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#f5d061" metalness={0.9} roughness={0.15} emissive="#f5d061" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

function MathSymbol({ position, symbol }: { position: [number, number, number]; symbol: 'plus' | 'multiply' | 'pi' | 'sigma' }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.15
  })

  const color = '#2cc4f5'

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={ref} position={position}>
        {symbol === 'plus' && (
          <group>
            <mesh>
              <boxGeometry args={[0.4, 0.08, 0.08]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}
        {symbol === 'multiply' && (
          <group rotation={[0, 0, Math.PI / 4]}>
            <mesh>
              <boxGeometry args={[0.4, 0.06, 0.06]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.4, 0.06, 0.06]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}
        {symbol === 'pi' && (
          <mesh>
            <torusGeometry args={[0.15, 0.04, 16, 32, Math.PI]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
          </mesh>
        )}
        {symbol === 'sigma' && (
          <mesh>
            <coneGeometry args={[0.2, 0.35, 3]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 0, -2]}>
        <Icosahedron args={[1.2, 1]}>
          <MeshDistortMaterial
            color="#1a2138"
            metalness={0.9}
            roughness={0.15}
            distort={0.25}
            speed={1.5}
            emissive="#0aa3d4"
            emissiveIntensity={0.08}
          />
        </Icosahedron>
      </mesh>
    </Float>
  )
}

function OrbitRing({ radius, tilt, color, speed }: { radius: number; tilt: number; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} transparent opacity={0.3} />
    </mesh>
  )
}

function Particle({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
    </mesh>
  )
}

function Particles() {
  const particles = useMemo(() => {
    const colors = ['#2cc4f5', '#f5d061', '#4ade80', '#5ddcff']
    return Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 1,
      ] as [number, number, number],
      color: colors[i % colors.length],
      size: Math.random() * 0.03 + 0.01,
    }))
  }, [])

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} position={p.position} color={p.color} size={p.size} />
      ))}
    </>
  )
}

interface Scene3DProps {
  variant?: 'hero' | 'compact'
}

export default function Scene3D({ variant = 'hero' }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, 2]} intensity={0.5} color="#2cc4f5" />
      <pointLight position={[5, 3, -2]} intensity={0.3} color="#f5d061" />

      <CoreSphere />

      <OrbitRing radius={1.8} tilt={0.3} color="#2cc4f5" speed={0.08} />
      <OrbitRing radius={2.3} tilt={-0.2} color="#f5d061" speed={-0.05} />
      <OrbitRing radius={2.8} tilt={0.5} color="#4ade80" speed={0.03} />

      {variant === 'hero' && (
        <>
          <FloatingCard position={[-2.2, 1.2, 1]} rotation={[0.1, -0.3, 0.05]} color="#1a2138" scale={0.7} />
          <FloatingCard position={[2.3, -0.8, 0.5]} rotation={[0.1, 0.3, -0.05]} color="#2e3853" scale={0.6} />
          <FloatingCard position={[1.8, 1.5, -0.5]} rotation={[-0.1, 0.2, 0.08]} color="#1a2138" scale={0.5} />

          <MathSymbol position={[-2.5, -1.5, 1]} symbol="plus" />
          <MathSymbol position={[2.8, 1.8, 0]} symbol="multiply" />
          <MathSymbol position={[-1.5, 2, 0.5]} symbol="pi" />
          <MathSymbol position={[1.2, -2, 1]} symbol="sigma" />
        </>
      )}

      {variant === 'compact' && (
        <>
          <FloatingCard position={[-1.5, 0.8, 0.5]} rotation={[0.1, -0.3, 0.05]} color="#1a2138" scale={0.5} />
          <FloatingCard position={[1.5, -0.5, 0]} rotation={[0.1, 0.3, -0.05]} color="#2e3853" scale={0.45} />
          <MathSymbol position={[-1.8, -1, 0.5]} symbol="plus" />
          <MathSymbol position={[1.8, 1.2, 0]} symbol="multiply" />
        </>
      )}

      <Particles />
    </Canvas>
  )
}
