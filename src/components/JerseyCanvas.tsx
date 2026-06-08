import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import JerseyModel from './JerseyModel'

interface JerseyCanvasProps {
  autoRotate?: boolean
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1.5, 0.1]} />
      <meshStandardMaterial color="#1a1a2e" wireframe />
    </mesh>
  )
}

export default function JerseyCanvas({ autoRotate = true }: JerseyCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4488ff" />
      <spotLight position={[0, 8, 0]} intensity={0.8} angle={0.4} penumbra={1} />

      <Suspense fallback={<Fallback />}>
        <JerseyModel autoRotate={autoRotate} />
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={4}
          blur={2}
          far={3}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}
