// Example: (admin)/dashboard/page.tsx
'use client'

import styles from './Dashboard.module.scss'
import { ShoppingBag, User, CreditCard, Package, Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


const stats = [
	{ label: 'Total Orders', value: 1287, icon: <ShoppingBag />, color: '#23539b', link: '/admin/orders' },
	{ label: 'Users', value: 623, icon: <User />, color: '#43bfa3', link: '/admin/users' },
	{ label: 'Sales (₺)', value: '₺92,400', icon: <CreditCard />, color: '#ffd166', link: '/admin/orders' },
	{ label: 'Products', value: 145, icon: <Package />, color: '#fca311', link: '/admin/products' }
]

const latestOrders = [
	{ id: 'A1009', user: 'Ali Veli', amount: '₺330', status: 'Preparing', date: '2025-05-25' },
	{ id: 'A1008', user: 'Zeynep Kaya', amount: '₺110', status: 'Delivered', date: '2025-05-25' }
]

const salesData = [
	{ date: 'May 1', total: 1300 },
	{ date: 'May 2', total: 1550 },
	{ date: 'May 3', total: 890 },
	// ...
]

export default function DashboardPage() {
	return (
		<div className={styles.dashboard}>
			<h1 className={styles.title}>Admin Dashboard</h1>
			{/* System warning example */}
			<div className={styles.warning}>
				<AlertCircle size={20} color="#d32f2f" /> 2 products are out of stock!
			</div>
			{/* Stat cards */}
			<div className={styles.statsGrid}>
				{stats.map(s => (
					<Link href={s.link} key={s.label} className={styles.statCard} style={{ borderColor: s.color }}>
						<div className={styles.icon} style={{ background: s.color + '22', color: s.color }}>
							{s.icon}
						</div>
						<div>
							<div className={styles.statValue}>{s.value}</div>
							<div className={styles.statLabel}>{s.label}</div>
						</div>
					</Link>
				))}
			</div>
			{/* Sales chart */}
			<div className={styles.section}>
				<h2>Sales Overview</h2>
				<div style={{ width: "100%", height: 250 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={salesData}>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="total" stroke="#23539b" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
			{/* Quick actions */}
			<div className={styles.quickActions}>
				<Link href="/admin/products/new" className={styles.quickBtn}><Plus /> Add Product</Link>
				<Link href="/admin/orders?status=pending" className={styles.quickBtn}><ShoppingBag /> Pending Orders</Link>
				{/* ... */}
			</div>
			{/* Latest Orders */}
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2>Recent Orders</h2>
					<Link href="/admin/orders" className={styles.sectionLink}>See all</Link>
				</div>
				<div className={styles.tableWrap}>
					<table className={styles.ordersTable}>
						<thead>
							<tr>
								<th>Order #</th>
								<th>User</th>
								<th>Amount</th>
								<th>Status</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{latestOrders.map(order => (
								<tr key={order.id}>
									<td>{order.id}</td>
									<td>{order.user}</td>
									<td>{order.amount}</td>
									<td>{order.status}</td>
									<td>{order.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}