'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext/AuthContext'
import styles from './LoginPage.module.scss'
import Link from 'next/link'
import { RenderIconHidePsw, RenderIconShowPsw } from "../register/RegularRegisterForm"

const LoginPage = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { flag, userType, errorMsg } = await login(username, password)
    if (flag) {
      setError('')
      if (userType === "admin") {
        router.push("/admin")
      } else if (userType === "regular") {
        router.push("/my-account")
      }
    } else {
      setError(errorMsg)
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
        <div className={styles.passwordWrapper}>
          <input
            className={styles.input}
            value={password}
            placeholder="Şifre*"
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            tabIndex={-1}
            className={styles.pwToggle}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
          >
            {showPassword ? RenderIconHidePsw : RenderIconShowPsw}
          </button>
        </div>
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
