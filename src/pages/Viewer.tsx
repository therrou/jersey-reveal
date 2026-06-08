import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import JerseyCanvasThree from '../components/JerseyCanvasThree'

export default function Viewer() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      style={{ position: 'relative', width: '100vw', height: '100vh', background: '#050505' }}
    >
      <JerseyCanvasThree
        progress={1}
        lightStartY={-6}
        lightEndY={0}
        lightZ={2.5}
        lightIntensity={10}
        lightDistance={6}
        lightDecay={2}
        modelBaseY={Math.PI}
        modelStartAngle={-0.6}
        modelEndAngle={-0.15}
        metalness={0}
        roughness={1}
        modelScale={1}
      />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }}>
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ← Back
        </motion.button>

        <p style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#888',
        }}>
          Drag to rotate · Scroll to zoom
        </p>
      </div>
    </motion.div>
  )
}
