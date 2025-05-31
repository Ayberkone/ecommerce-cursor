'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './VerifyEmail.module.scss'
import { CheckCircle, XCircle } from 'lucide-react'
import { api } from "@/utils/api"

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
		async function verifyEmail() {
			// Call backend to verify token
			await api(`/api/auth/verify-email?token=${token}`, {
				method: 'GET',
				showLoader: true
			}).then(async res => {
				const data = await res.json()
				if (res.ok) {
					setStatus('success')
					setMessage(data.message || 'E-posta başarıyla doğrulandı!')
				} else {
					setStatus('error')
					setMessage(data.message || 'Bir hata oluştu.')
				}
			}).catch(() => {
				setStatus('error')
				setMessage('Sunucuya ulaşılamadı.')
			})
		}
		verifyEmail()
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