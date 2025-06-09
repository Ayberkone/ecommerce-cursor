// app/not-found.tsx
'use client'

import Link from 'next/link'
import styles from '../styles/NotFound.module.scss' // Optional, add your own styles

export default function NotFound() {
	return (
		<div className={styles.notFound || ''}>
			<h1>404</h1>
			<h2>Bu sayfa bulunamadı.</h2>
			<p>Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
			<Link href="/" className={styles.link || ''}>
				Ana sayfaya dön
			</Link>
		</div>
	)
}