import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
export interface JerseyCanvasProps {
  progress: number
  lightStartY: number
  lightEndY: number
  lightZ: number
  lightIntensity: number
  lightDistance: number
  lightDecay: number
  modelBaseY: number
  modelStartAngle: number
  modelEndAngle: number
  metalness: number
  roughness: number
  modelScale: number
}

interface Props extends JerseyCanvasProps {}

export default function JerseyCanvasThree(props: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Scene ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Camera ────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 4)

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = false // no shadows — stylised look
    mount.appendChild(renderer.domElement)

    // ── Lights ────────────────────────────────────────────────────────
    // Near-zero ambient — jersey is pure silhouette at progress=0
    const ambient = new THREE.AmbientLight(0x0d1a33, 0.08)
    scene.add(ambient)

    // PointLight: emits in all directions from its position.
    // Positioned in front of the jersey (positive Z) and travels bottom→top.
    // Creates the "pool of light sweeping upward" look without cone artefacts.
    const pointLight = new THREE.PointLight(0xffffff, 0)
    scene.add(pointLight)

    // ── Model ─────────────────────────────────────────────────────────
    let model: THREE.Object3D | null = null
    let baseScale = 1
    const materials: THREE.MeshStandardMaterial[] = []
    const loader = new GLTFLoader()

    loader.load(
      '/models/jersey-hires/scene.gltf',
      (gltf) => {
        model = gltf.scene

        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughnessMap = null   // let slider be authoritative
              mat.metalnessMap = null   // let slider be authoritative
              mat.emissive.set(0, 0, 0)
              mat.emissiveIntensity = 0
              mat.needsUpdate = true
              materials.push(mat)
            }
          })
        })

        // Center + uniform scale
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const isMobile = mount.clientWidth < 768
        baseScale = (isMobile ? 1.75 : 2.5) / Math.max(size.x, size.y, size.z)
        model.scale.setScalar(baseScale)
        model.position.sub(center.multiplyScalar(baseScale))

        scene.add(model)
      },
      undefined,
      (err) => console.error('GLTF load error:', err),
    )

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Render loop ───────────────────────────────────────────────────
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const p = propsRef.current
      const t = Math.max(0, Math.min(1, p.progress))

      // PointLight travels from lightStartY → lightEndY in front of the jersey
      const lightY = p.lightStartY + (p.lightEndY - p.lightStartY) * t
      pointLight.position.set(0, lightY, p.lightZ)
      pointLight.intensity = p.lightIntensity * t
      pointLight.distance = p.lightDistance
      pointLight.decay = p.lightDecay

      // Model rotation + scale
      if (model) {
        const angle = p.modelStartAngle + (p.modelEndAngle - p.modelStartAngle) * t
        model.rotation.y = p.modelBaseY + angle
        model.scale.setScalar(baseScale * p.modelScale)
      }

      // Roughness + metalness — applied each frame so sliders respond instantly
      for (const mat of materials) {
        mat.roughness = p.roughness
        mat.metalness = p.metalness
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
