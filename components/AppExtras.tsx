'use client'

import { useEffect, useState } from "react"
import WhatsAppButton from "./WhatsappButton/WhatsappButton"
import WhatsAppInfoModal from "./WhatsappInfoModal/WhatsappInfoModal"

const WHATSAPP_INFO_KEY = "wa_info_shown_at"
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30

export default function AppExtras() {
	const [showInfo, setShowInfo] = useState(false)

	useEffect(() => {
		const hidePermanently = localStorage.getItem('hideWhatsappInfoModal') === 'true'
		if (hidePermanently) {
			return
		}

		const lastShown = localStorage.getItem(WHATSAPP_INFO_KEY)
		if (!lastShown || (Date.now() - Number(lastShown) > ONE_MONTH_MS)) {
			setShowInfo(true)
		}
	}, [])

	const handleModalClose = () => {
		localStorage.setItem(WHATSAPP_INFO_KEY, Date.now().toString())
		setShowInfo(false)
	}

	return (
		<>
			<WhatsAppButton />
			<WhatsAppInfoModal open={showInfo} onClose={handleModalClose} />
		</>
	)
}