'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {isMounted && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.27, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ minHeight: '100vh' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
