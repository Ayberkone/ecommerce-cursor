'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext/AuthContext'
import styles from './LoginPage.module.scss'
import Link from 'next/link'

const LoginPage = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = await login(username, password)
    if (ok) {
      router.push('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.button} type="submit">Login</button>
      </form>
      <div className={styles.bottom}>
        Don’t have an account?{' '}
        <Link href="/register" className={styles.link}>Register</Link>
      </div>
    </main>
  )
}

export default LoginPage
