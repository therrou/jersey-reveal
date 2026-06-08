import { motion, AnimatePresence } from 'framer-motion'

interface RevealOverlayProps {
  revealed: boolean
  onReveal: () => void
}

const curtainVariants = {
  closed: { scaleY: 1 },
  open: {
    scaleY: 0,
    transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' as const },
  },
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.04 },
  tap: { scale: 0.97 },
}

export default function RevealOverlay({ revealed, onReveal }: RevealOverlayProps) {
  return (
    <AnimatePresence>
      {!revealed && (
        <>
          {/* Top curtain */}
          <motion.div
            key="curtain-top"
            variants={curtainVariants}
            initial="closed"
            animate={revealed ? 'open' : 'closed'}
            exit="open"
            style={{
              position: 'absolute',
              inset: 0,
              bottom: '50%',
              background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
              transformOrigin: 'top',
              zIndex: 10,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 48,
            }}
          >
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ textAlign: 'center' }}
            >
              <p style={{
                fontSize: 11,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: 12,
              }}>
                Season 2025/26
              </p>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                lineHeight: 0.9,
                color: '#fff',
              }}>
                New Kit<br />
                <span style={{ color: '#c8a84b' }}>Revealed</span>
              </h1>
            </motion.div>
          </motion.div>

          {/* Bottom curtain */}
          <motion.div
            key="curtain-bottom"
            variants={curtainVariants}
            initial="closed"
            animate={revealed ? 'open' : 'closed'}
            exit="open"
            style={{
              position: 'absolute',
              inset: 0,
              top: '50%',
              background: 'linear-gradient(0deg, #0a0a0a 0%, #111 100%)',
              transformOrigin: 'bottom',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: 48,
            }}
          >
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={onReveal}
              style={{
                background: 'transparent',
                border: '1.5px solid #fff',
                color: '#fff',
                fontSize: 11,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                padding: '14px 40px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reveal Kit
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
