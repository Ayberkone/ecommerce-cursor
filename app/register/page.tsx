'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserType } from '@/components/AuthContext/AuthContext'
import styles from './RegisterPage.module.scss'
import Link from 'next/link'

const userTypeOptions = [
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'regular', label: 'Regular User' },
]

const RegisterPage = () => {
  const { register } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState<UserType>('regular')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (username.length < 3 || password.length < 4) {
      setError('Username min 3, password min 4 characters.')
      return
    }
    const ok = await register(username, password, type)
    if (ok) {
      router.push('/')
    } else {
      setError('Username already exists')
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Register</h1>
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
          autoComplete="new-password"
        />
        <select
          className={styles.input}
          value={type}
          onChange={e => setType(e.target.value as UserType)}
        >
          {userTypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.button} type="submit">Register</button>
      </form>
      <div className={styles.bottom}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>Login</Link>
      </div>
    </main>
  )
}

export default RegisterPage
