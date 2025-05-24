import React from 'react'
import styles from './Modal.module.scss'
import { X } from 'lucide-react'
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
      <div className={styles.backdrop} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .3, ease: true }}
        >
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <X
              color="#555"
              size={32}
              className={styles.closeBtn}
              onClick={onClose}
            />
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
