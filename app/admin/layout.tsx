import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/utils/authServer"

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const user = await getUserFromCookies()
	if (!user) redirect(`/login?next=/admin`)
	if (typeof user !== "object" || !("type" in user) || user.type !== "admin") redirect("/")
	return <>{children}</>
}