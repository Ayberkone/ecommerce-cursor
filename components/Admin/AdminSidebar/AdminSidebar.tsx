// components/Admin/AdminSidebar.tsx
'use client'

import Link from "next/link"
import styles from "./AdminSidebar.module.scss"
import { useAuth } from '@/context/AuthContext/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from "lucide-react"

const menu = [
	{ label: "Dashboard", href: "/admin" },
	{ label: "Orders", href: "/admin/orders" },
	{ label: "Users", href: "/admin/users" },
	{ label: "Products", href: "/admin/products" },
]

export default function AdminSidebar() {
	const { logout } = useAuth()
	const router = useRouter()

	function handleLogout() {
		logout()
		router.push('/')
	}

	return (
		<aside className={styles.sidebar}>
			<nav>
				<ul>
					{menu.map(item => (
						<li key={item.href}>
							<Link href={item.href}>{item.label}</Link>
						</li>
					))}
					<button
						className={styles.menuItem}
						onClick={() => handleLogout()}
						type="button"
					>
						Cikis yap
						<span className={styles.icon}><LogOut size={20} /></span>
					</button>
				</ul>
			</nav>
		</aside>
	)
}