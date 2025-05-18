'use client'

import { useAuth } from '@/components/AuthContext/AuthContext'
import { useState, useEffect } from 'react'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    // Load saved display name, else fallback to username
    const savedProfile = JSON.parse(localStorage.getItem(`profile_${user.username}`) || '{}')
    setDisplayName(savedProfile.displayName || user.username)
  }, [user])

  if (!user) return <div>Lütfen giriş yapın.</div>

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem(`profile_${user?.username}`, JSON.stringify({ displayName }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Hesap Bilgileri</h1>
      <form className={styles.form} onSubmit={handleSave}>
        <label className={styles.label}>
          Kullanıcı Adı (değiştirilemez)
          <input
            className={styles.input}
            value={user.username}
            disabled
            readOnly
          />
        </label>
        <label className={styles.label}>
          Kullanıcı Tipi
          <input
            className={styles.input}
            value={user.type.charAt(0).toUpperCase() + user.type.slice(1)}
            disabled
            readOnly
          />
        </label>
        <label className={styles.label}>
          Görünen Adınız
          <input
            className={styles.input}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            maxLength={32}
          />
        </label>
        <button className={styles.saveBtn} type="submit">
          Kaydet
        </button>
        {saved && <div className={styles.saved}>Kaydedildi!</div>}
      </form>
    </main>
  )
}
