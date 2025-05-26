// components/Admin/AdminSidebar.tsx
import Link from "next/link"
import styles from "./AdminSidebar.module.scss"

const menu = [
	{ label: "Dashboard", href: "/admin" },
	{ label: "Orders", href: "/admin/orders" },
	{ label: "Users", href: "/admin/users" },
	{ label: "Products", href: "/admin/products" },
]

export default function AdminSidebar() {
	return (
		<aside className={styles.sidebar}>
			<nav>
				<ul>
					{menu.map(item => (
						<li key={item.href}>
							<Link href={item.href}>{item.label}</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	)
}