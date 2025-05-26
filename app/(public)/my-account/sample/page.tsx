'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import { useState } from 'react'
import styles from './SamplePage.module.scss'

export default function SamplePage() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.type !== 'doctor') {
    return <div>Bu sayfa sadece doktorlar için kullanılabilir.</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!message.trim()) {
      setError('Lütfen talebinizi yazınız.')
      return
    }
    // Store sample requests as an array in localStorage
    const key = 'sample_requests'
    const previous = JSON.parse(localStorage.getItem(key) || '[]')
    const req = {
      user: {
        username: user.username,
        type: user.type,
        // If you store displayName: fetch from profile_{username}
        displayName: JSON.parse(localStorage.getItem(`profile_${user.username}`) || '{}').displayName || user.username
      },
      message,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(key, JSON.stringify([req, ...previous]))
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Numune Talebi</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Talep ve Notunuz
          <textarea
            className={styles.textarea}
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            maxLength={800}
            placeholder="İhtiyacınız olan ürün veya notunuzu buraya yazınız..."
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submitBtn} type="submit">Talep Gönder</button>
        {sent && <div className={styles.sent}>Talebiniz iletildi. Teşekkürler!</div>}
      </form>
    </main>
  )
}
