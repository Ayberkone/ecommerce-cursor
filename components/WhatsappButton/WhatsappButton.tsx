// components/WhatsAppButton.tsx

'use client'

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from 'lucide-react'
import styles from './WhatsAppButton.module.scss'
import Image from "next/legacy/image"

const WHATSAPP_URL = "https://wa.me/+902166680062?text=Merhaba,%20ben%20websitenizden%20ulaşıyorum.%20Yardım%20almak%20istiyorum."

export default function WhatsAppButton({ onClick }: { onClick?: () => void }) {
	return (
		<AnimatePresence>
			<motion.a
				href={WHATSAPP_URL}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.whatsappButton}
				initial={{ scale: 1, boxShadow: "0 0 0 0 #25D366" }}
				animate={{
					scale: [1, 1.08, 1]
				}}
				transition={{ repeat: 4, repeatType: 'mirror', duration: 2, ease: "easeInOut" }}
				onClick={onClick}
			>
				<Image src="/img/wp-icon.png" width={28} height={28} alt="WhatsApp Icon" />
				<span className={styles.buttonText}>WhatsApp ile İletişime Geç</span>
			</motion.a>
		</AnimatePresence>
	)
}