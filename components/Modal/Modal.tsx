import React from 'react'
import styles from './Modal.module.scss'
import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.21 }}
      >
        <div className={styles.backdrop} onClick={onClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">✕</button>
            {children}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
