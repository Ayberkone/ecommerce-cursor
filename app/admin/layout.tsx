import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/utils/authServer"
import AdminSidebar from "@/components/Admin/AdminSidebar/AdminSidebar"
import styles from "./AdminLayout.module.scss"

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const user = await getUserFromCookies()
	if (!user) redirect(`/login?next=/admin`)
	if (user.type !== "admin") redirect("/")
	return (
		<div className={styles.adminLayout}>
			<AdminSidebar />
			<main className={styles.adminMain}>{children}</main>
		</div>
	)
}