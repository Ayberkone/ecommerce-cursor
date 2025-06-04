'use client'

import styles from './AdminSidebar.module.scss'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, LogOut, Box, User, ShoppingBag, Settings, SwatchBook } from 'lucide-react'
import { useAuth } from '@/context/AuthContext/AuthContext'

const adminMenu = [
	// { key: 'dashboard', label: 'Panel', href: '/admin', icon: Box },
	{ key: 'orders', label: 'Siparişler', href: '/admin/orders', icon: Box },
	{ key: 'products', label: 'Ürünler', href: '/admin/products', icon: ShoppingBag },
	{ key: 'users', label: 'Kullanıcılar', href: '/admin/users', icon: User },
	{ key: 'samples', label: 'N.Talepleri', href: '/admin/samples', icon: SwatchBook },
	{ key: 'rest', label: 'Diğer', href: '/admin/categories-brands', icon: User },
	{ key: 'settings', label: 'Ayarlar', href: '/admin/settings', icon: Settings }
]

export default function AdminSidebar() {
	const { logout } = useAuth()
	const pathname = usePathname()
	const router = useRouter()
	const [isMounted, setIsMounted] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(false) // Default to open for SSR

	useEffect(() => {
		setIsMounted(true)
		if (typeof window !== 'undefined') {
			const savedState = localStorage.getItem('adminSidebarOpen')
			if (savedState !== null) {
				setDrawerOpen(JSON.parse(savedState))
			}
		}
	}, [])

	// Effect to save drawerOpen state to localStorage whenever it changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('adminSidebarOpen', JSON.stringify(drawerOpen))
		}
	}, [drawerOpen])

	// Active key for highlighting
	const activeKey =
		adminMenu
			.filter(item => item.href !== '/admin') // Exclude the dashboard route from matching
			.find(item => pathname?.startsWith(item.href))?.key
		|| (pathname === '/admin' ? 'dashboard' : undefined)

	function handleClick(item: typeof adminMenu[0]) {
		if (item.key === 'logout') {
			logout()
			router.push('/login')
		}
	}

	return (
		<>
			{/* Overlay */}
			{drawerOpen && (
				<div
					className={styles.overlay}
					onClick={() => setDrawerOpen(false)}
					tabIndex={-1}
					aria-label="Menüyü kapat"
				/>
			)}
			<aside
				className={`${styles.menu} ${drawerOpen ? styles.open : ''}`}
				onMouseEnter={() => setDrawerOpen(true)}
			>
				<div className={styles.menuContent}>
					<button
						className={`${styles.hamburger} ${drawerOpen ? styles.open : ''}`}
						aria-label="Admin menüsünü aç"
						onClick={() => setDrawerOpen(x => !x)}
						type="button"
					>
						<Menu size={28} />
					</button>
					<div
						className={styles.adminHeader}
						style={{ cursor: isMounted ? 'pointer' : 'default' }}
						onClick={() => router.push('/admin')}
					>
						Admin Panel
					</div>
					{adminMenu.map(item => (
						<Link
							key={item.key}
							href={item.href}
							className={`${styles.menuItem} ${activeKey === item.key ? styles.active : ''}`}
							onClick={() => handleClick(item)}
						>
							<span className={styles.icon}><item.icon size={20} /></span>
							{item.label}
						</Link>
					))}
					<button
						className={styles.menuItem + ' ' + styles.logout}
						aria-label="Çıkış Yap"
						onClick={() => handleClick({ key: 'logout' } as any)}
						type="button"
					>
						<span className={styles.icon}><LogOut size={20} /></span>
						Çıkış Yap
					</button>
				</div>
			</aside>
		</>
	)
}