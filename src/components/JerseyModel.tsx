import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

interface JerseyModelProps {
  autoRotate?: boolean
}

export default function JerseyModel({ autoRotate = true }: JerseyModelProps) {
  const ref = useRef<Group>(null)
  const { scene } = useGLTF('/models/jersey.glb')

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.4
    }
  })

  return <primitive ref={ref} object={scene} />
}

useGLTF.preload('/models/jersey.glb')
