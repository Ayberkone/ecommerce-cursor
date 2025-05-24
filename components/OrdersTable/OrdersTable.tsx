'use client'
import { useEffect, useState } from "react"
import styles from './OrdersTable.module.scss'
import { paymentStatusLabels, orderStatusLabels, paymentMethods, cargoCompanies } from "./ordersTableConfig"
import { api } from "@/utils/api"
import { toast } from "sonner"

export default function OrdersTable({ admin = false }) {
	const [orders, setOrders] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		api("/api/orders" + (admin ? "/admin" : ""), { method: "GET" })
			.then(setOrders)
			.catch(() => toast.error("Siparişler alınamadı"))
			.finally(() => setLoading(false))
	}, [admin])

	const updateOrderStatus = async (orderId: string, field: "status" | "paymentStatus", value: string) => {
		try {
			await api(`/api/orders/admin/${orderId}/${field}`, {
				method: "PATCH",
				body: JSON.stringify({ [field]: value })
			})
			setOrders(orders =>
				orders.map(o => o._id === orderId ? { ...o, [field]: value } : o)
			)
			toast.success("Güncellendi!")
		} catch {
			toast.error("Güncellenemedi")
		}
	}

	if (loading) return <div>Yükleniyor...</div>

	// *** USER TABLE ***
	if (!admin) {
		return (
			<div className={styles.ordersTableWrap}>
				<table className={styles.ordersTable}>
					<thead>
						<tr>
							<th>Kod</th>
							<th>Tutar</th>
							<th>Adres</th>
							<th>Ürün Sayısı</th>
							<th>Durum</th>
							<th>Görüntüle</th>
						</tr>
					</thead>
					<tbody>
						{orders?.length > 0
							? orders.map(order => (
								<tr key={order._id || order.id}>
									<td>
										<span className={styles.orderCode}>{order._id || order.id}</span>
									</td>
									<td>{order.total}₺</td>
									<td>{order.address}</td>
									<td>{order.items?.length || 0}</td>
									<td>
										<span className={styles.status}>{orderStatusLabels[order.status as keyof typeof orderStatusLabels]}</span>
									</td>
									<td>
										<a
											className={styles.detailBtn}
											href={`/my-account/orders/${order._id || order.id}`}
										>
											Detay
										</a>
									</td>
								</tr>
							))
							: <tr><td>Siparis Bulunamadi</td></tr>}
					</tbody>
				</table>
			</div>
		)
	}

	// *** ADMIN TABLE (your full version) ***
	return (
		<div className={styles.ordersTableWrap}>
			<table className={styles.ordersTable}>
				<thead>
					<tr>
						<th>Kod</th>
						<th>Tarih</th>
						<th>Müşteri</th>
						<th>Tutar</th>
						<th>Ödeme Yöntemi</th>
						<th>Ödeme Durumu</th>
						<th>Sipariş Durumu</th>
						<th>Kargo Firması</th>
						<th>Kargo No</th>
						<th>Adres</th>
						<th>Ürün</th>
						<th>Görünüm</th>
					</tr>
				</thead>
				<tbody>
					{orders.map(order => (
						<tr key={order._id || order.id}>
							<td>{order._id || order.id}</td>
							<td>{new Date(order.createdAt).toLocaleString("tr-TR")}</td>
							<td>{order.customer || order.email || "-"}</td>
							<td>{order.total}₺</td>
							<td>{paymentMethods[order.paymentMethod as keyof typeof paymentMethods] || order.paymentMethod}</td>
							<td>
								{admin ? (
									<select
										value={order.paymentStatus}
										onChange={e => updateOrderStatus(order._id, "paymentStatus", e.target.value)}
									>
										{Object.entries(paymentStatusLabels).map(([v, label]) => (
											<option key={v} value={v}>{label}</option>
										))}
									</select>
								) : (
									<span>{paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}</span>
								)}
							</td>
							<td>
								{admin ? (
									<select
										value={order.status}
										onChange={e => updateOrderStatus(order._id, "status", e.target.value)}
									>
										{Object.entries(orderStatusLabels).map(([v, label]) => (
											<option key={v} value={v}>{label}</option>
										))}
									</select>
								) : (
									<span>{orderStatusLabels[order.status as keyof typeof orderStatusLabels]}</span>
								)}
							</td>
							<td>{cargoCompanies[order.cargoCompany as keyof typeof cargoCompanies] || order.cargoCompany || "-"}</td>
							<td>{order.cargoNo || "-"}</td>
							<td>{order.address}</td>
							<td>{order.items?.length || 0}</td>
							<td>
								<a
									className={styles.detailBtn}
									href={`/my-account/orders/${order._id || order.id}`}
								>
									Detay
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}