'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import { useState } from 'react'
import styles from './SamplePage.module.scss'
import { api } from '@/utils/api'
import Link from "next/link"

export default function SamplePage() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.type !== 'doctor') {
    return <div>Bu sayfa sadece doktorlar için kullanılabilir.</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!message.trim()) {
      setError('Lütfen talebinizi yazınız.')
      return
    }
    try {
      const payload = {
        name: user.firstName + ' ' + user.lastName, // Assuming firstName and lastName are available
        email: user.username, // Assuming username is the email
        phone: user.phone || '', // Fetch from profile or leave empty if not available
        message
      }
      // Ensure all required fields for the backend are present, even if empty strings
      if (!payload.name) {
        setError('Kullanıcı adı alınamadı.')
        return
      }
      if (!payload.email) {
        setError('E-posta adresi alınamadı.')
        return
      }
      await api('/api/samples', { // Updated to use API endpoint
        method: 'POST',
        body: JSON.stringify(payload),
        showLoader: true
      })

      setSent(true)
      setMessage('')
    } catch (err: any) {
      setError(err.message || 'Talep gönderilirken bir hata oluştu.')
      setSent(false) // Ensure sent is false on error
    }
  }

  return (
    <div className={styles.main}>
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
        {error && (
          <>
            <div className={styles.error}>{error}</div>
            <Link href="/my-account/addresses">Adres bilgisi eklemek için tıklayın.</Link>
          </>
        )}
        <button className={styles.submitBtn} type="submit">Talep Gönder</button>
        {sent && <div className={styles.sent}>Talebiniz iletildi. Teşekkürler!</div>}
      </form>
    </div>
  )
}
