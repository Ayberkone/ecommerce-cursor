'use client'

import { useAuth } from '@/components/AuthContext/AuthContext'
import { useState } from 'react'
import styles from './PasswordPage.module.scss'

export default function PasswordPage() {
  const { user, logout } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [nextRepeat, setNextRepeat] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!user) return <div>Lütfen giriş yapın.</div>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    // Load user from localStorage "users"
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex((u: any) => u.username === user.username)
    if (idx === -1) {
      setError('Kullanıcı bulunamadı.')
      return
    }
    if (users[idx].password !== current) {
      setError('Mevcut parola yanlış.')
      return
    }
    if (next.length < 4) {
      setError('Yeni parola en az 4 karakter olmalı.')
      return
    }
    if (next !== nextRepeat) {
      setError('Yeni parolalar eşleşmiyor.')
      return
    }
    users[idx].password = next
    localStorage.setItem('users', JSON.stringify(users))
    setSuccess(true)
    setCurrent('')
    setNext('')
    setNextRepeat('')
    // Optionally, log out user after password change:
    // logout()
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Parola Ayarları</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Mevcut Parola
          <input
            className={styles.input}
            type="password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <label className={styles.label}>
          Yeni Parola
          <input
            className={styles.input}
            type="password"
            value={next}
            onChange={e => setNext(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className={styles.label}>
          Yeni Parola (Tekrar)
          <input
            className={styles.input}
            type="password"
            value={nextRepeat}
            onChange={e => setNextRepeat(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.saveBtn} type="submit">
          Parolayı Değiştir
        </button>
        {success && <div className={styles.success}>Parola başarıyla değiştirildi.</div>}
      </form>
    </main>
  )
}
