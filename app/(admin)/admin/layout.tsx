// app/admin/layout.tsx
import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/utils/authServer"
import AdminSidebar from "@/components/Admin/AdminSidebar/AdminSidebar"
import Providers from "@/components/Providers/Providers"
import styles from "./AdminLayout.module.scss"
import '../../globals.scss'

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
	const user = await getUserFromCookies()
	if (!user) redirect(`/login?next=/admin`)
	if (user.type !== "admin") redirect("/")
	return (
		<html lang="tr">
			<body>
				<Providers>
					<div className={styles.adminLayout}>
						<AdminSidebar />
						<main className={styles.adminMain}>{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	)
}