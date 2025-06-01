import React from "react"
import styles from "./FormLayout.module.scss"

type FormLayoutProps = {
	title?: string
	icon?: React.ReactNode
	children: React.ReactNode
	className?: string
}

export default function FormLayout({ title, icon, children, className }: FormLayoutProps) {
	return (
		<div className={styles.formWrapper}>
			<div className={styles.formContainer + (className ? ` ${className}` : "")}>
				{title && (
					<div className={styles.formHeader}>
						{icon && <div className={styles.icon}>{icon}</div>}
						<b>{title}</b>
					</div>
				)}
				{children}
			</div>
		</div>
	)
}