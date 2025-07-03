// components/WhatsAppInfoModal.tsx

import Modal from "@/components/Modal/Modal"
import Image from 'next/legacy/image'
import { useState } from "react"

export default function WhatsAppInfoModal({ open, onClose }: { open: boolean, onClose: () => void }) {
	const [dontShowAgain, setDontShowAgain] = useState(false)

	const handleClose = () => {
		if (dontShowAgain) {
			localStorage.setItem('hideWhatsappInfoModal', 'true')
		}
		onClose()
	}

	return (
		<Modal open={open} onClose={handleClose}>
			<div className="w-100 p-24">
				<Image
					src={"/img/whatsapp-modal.jpg"}
					alt={"WhatsApp Bilgi"}
					layout="responsive"
					objectFit="contain"
					width={420}
					height={300}
					style={{ borderRadius: 8 }}
					priority
				/>
			</div>
			<div className="p-4 d-flex items-center justify-end">
				<input
					type="checkbox"
					id="dontShowAgain"
					checked={dontShowAgain}
					onChange={(e) => setDontShowAgain(e.target.checked)}
					className="mr-2"
				/>
				<label htmlFor="dontShowAgain" className="cursor-pointer select-none">
					Bir daha gösterme
				</label>
			</div>
		</Modal>
	)
}