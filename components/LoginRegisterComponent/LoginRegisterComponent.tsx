"use client"
import React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Stethoscope, Plus } from "lucide-react"
import styles from './LoginRegisterComponent.module.scss'

const cards = [
	{
		title: "Üye Ol",
		titleClass: styles.registerTitle,
		icon: <UserPlus size={40} />,
		description: "Üye ol, indirimlerden ve gelişmelerden haberdar ol.",
		href: "/register",
		btnClassName: "btn btn-primary",
		btnText: "Üye Ol"
	},
	{
		title: "Eczacı Mısınız?",
		titleClass: styles.pharmacistTitle,
		icon: <Plus strokeWidth={4} stroke="#d32f2f" size={40} />,
		description:
			"Hemen Pro üyelik oluştur, kampanyalardan ve indirimlerden haberdar ol. İndirimli fiyatlardan yararlan!",
		href: "/register?type=pro",
		btnClassName: "btn btn-danger",
		btnText: "Pro Üyelik Oluştur"
	},
	{
		title: "Doktor Musunuz?",
		titleClass: styles.doctorTitle,
		icon: <Stethoscope size={40} stroke="#23539b" />,
		description:
			"Pro üyelik oluştur, Farmalink ve Gengigel özel literatür ve çalışmalara erişim sağla! Bunlara ek olarak kampanyalardan ve indirimlerden haberdar ol.",
		href: "/register?type=pro",
		btnClassName: "btn btn-primary",
		btnText: "Pro Üyelik Oluştur"
	}
]

const LoginRegisterComponent: React.FC = () => {
	const router = useRouter()

	return (
		<section id="markaalan" className={styles.section}>
			<div className="container">
				<div className={styles.cards}>
					{cards.map((card, idx) => (
						<div
							key={idx}
							onClick={() => router.push(card.href)}
							className={styles.card}
						>
							<div className="d-flex align-center mb-10">
								<div>{card.icon}</div>
								<h1 className={card.titleClass}>{card.title}</h1>
							</div>
							<p>{card.description}</p>
							<div className={styles.cardLink}>
								<button className={card.btnClassName} type="button">
									{card.btnText}
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default LoginRegisterComponent