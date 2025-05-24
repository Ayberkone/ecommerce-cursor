import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import styles from './RejectionModal.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (note: string) => void
  loading?: boolean
}

export default function RejectionModal({ open, onClose, onConfirm, loading }: Props) {
  const [note, setNote] = useState('')

  // Optional: Reset note on open/close
  useEffect(() => {
    if (!open) setNote('')
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <h2 className="titleDetail">Reddetme Notu</h2>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Lütfen reddetme sebebini yazın…"
          rows={4}
          className={styles.textarea}
        />
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn} disabled={loading}>İptal</button>
          <button
            onClick={() => onConfirm(note)}
            className={styles.confirmBtn}
            disabled={loading || !note.trim()}
          >
            {loading ? 'Reddediliyor…' : 'Reddet'}
          </button>
        </div>
      </div>
    </Modal>
  )
}