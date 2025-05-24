'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './VerifyEmail.module.scss'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const [message, setMessage] = useState('Doğrulanıyor...')

	useEffect(() => {
		// Use .get() only ONCE at mount
		const token = searchParams.get('token')
		if (!token) {
			setStatus('error')
			setMessage('Doğrulama bağlantısı hatalı.')
			return
		}
		// Call backend to verify token
		fetch(`/api/auth/verify-email/${token}`)
			.then(async res => {
				const data = await res.json()
				if (res.ok) {
					setStatus('success')
					setMessage(data.message || 'E-posta başarıyla doğrulandı!')
				} else {
					setStatus('error')
					setMessage(data.message || 'Bir hata oluştu.')
				}
			})
			.catch(() => {
				setStatus('error')
				setMessage('Sunucuya ulaşılamadı.')
			})
		// No dependencies: only runs on mount
		// eslint-disable-next-line
	}, [])

	return (
		<div className={styles.verifyWrapper}>
			{status === 'loading' && (
				<div className={styles.statusBox}>
					<span className={styles.loader} />
					<span>{message}</span>
				</div>
			)}
			{status === 'success' && (
				<div className={`${styles.statusBox} ${styles.success}`}>
					<CheckCircle size={56} color="#43bfa3" />
					<h2>E-posta doğrulandı!</h2>
					<p>{message}</p>
					<button className={styles.goLogin} onClick={() => router.push('/login')}>Giriş Yap</button>
				</div>
			)}
			{status === 'error' && (
				<div className={`${styles.statusBox} ${styles.error}`}>
					<XCircle size={56} color="#d32f2f" />
					<h2>Doğrulama Başarısız</h2>
					<p>{message}</p>
					<button className={styles.goLogin} onClick={() => router.push('/login')}>Giriş Sayfasına Dön</button>
				</div>
			)}
		</div>
	)
}