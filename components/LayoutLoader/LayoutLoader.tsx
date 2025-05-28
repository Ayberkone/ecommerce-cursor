"use client"
import { useLoader } from "@/context/LoaderContext/LoaderContext"
import styles from "./LayoutLoader.module.scss"

export default function LayoutLoader() {
	const { visible } = useLoader()
	if (!visible) return null

	return (
		<div className={styles.overlay}>
			<div className={styles.spinner} />
		</div>
	)
}