'use client'
import { useRouter } from 'next/navigation'
import styles from './MobileAccountHeader.module.scss'
import { ChevronLeft } from 'lucide-react'
import { useIsMobile } from "@/hooks/useIsMobile"

type Props = {
	title: string
	show?: boolean // Optionally force show/hide
	backUrl?: string // Optional custom back destination
}

export default function MobileAccountHeader({ title, show, backUrl = '/my-account' }: Props) {
	const router = useRouter()
	const isMobile = useIsMobile() // Now handled with our hook

	if (show === false || (!show && !isMobile)) return null

	return (
		<div className={styles.mobileHeader}>
			<button onClick={() => router.push(backUrl)} className={styles.backBtn} aria-label="Geri dön">
				<ChevronLeft size={28} />
			</button>
			<div className={styles.headerTitle}>{title}</div>
		</div>
	)
}