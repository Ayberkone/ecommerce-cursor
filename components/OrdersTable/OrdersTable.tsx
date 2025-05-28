'use client'
import { useEffect, useState } from "react"
import styles from './OrdersTable.module.scss'
import { paymentStatusLabels, orderStatusLabels, paymentMethods, cargoCompanies } from "./ordersTableConfig"
import { api } from "@/utils/api"
import { toast } from "sonner"
import { Table } from "@/components/Table/Table"

type Order = {
	_id: string
	createdAt: string
	customer?: string
	email?: string
	total: number
	paymentMethod: string
	paymentStatus: string
	status: string
	cargoCompany?: string
	cargoNo?: string
	address: string
	items: any[]
}

export default function OrdersTable({ admin = false }) {
	const [orders, setOrders] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		api("/api/" + (admin ? "admin/" : "") + "orders", { method: "GET", showLoader: true })
			.then(setOrders)
			.catch(() => toast.error("Siparişler alınamadı"))
			.finally(() => setLoading(false))
	}, [admin])

	const updateOrderStatus = async (orderId: string, field: "status" | "paymentStatus", value: string) => {
		try {
			await api(`/api/admin/orders/${orderId}/${field}`, {
				method: "PATCH",
				showLoader: true,
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
		const columns = [
			{
				header: "Kod",
				accessor: (row: Order) => (
					<span className={styles.orderCode}>{row._id}</span>
				)
			},
			{ header: "Tutar", accessor: (row: Order) => `${row.total}₺` },
			{ header: "Adres", accessor: (row: Order) => row.address },
			{ header: "Ürün Sayısı", accessor: (row: Order) => row.items?.length || 0 },
			{
				header: "Durum",
				accessor: (row: Order) => row.status,
				cell: (value: string) => (
					<span className={styles.status}>{orderStatusLabels[value as keyof typeof orderStatusLabels]}</span>
				)
			},
			{
				header: "Görüntüle",
				accessor: (row: Order) => row._id,
				cell: (id: string) => (
					<a className={styles.detailBtn} href={`/my-account/orders/${id}`}>Detay</a>
				)
			}
		]
		return (
			<div className={styles.ordersTableWrap}>
				<Table<Order>
					columns={columns}
					data={orders}
					rowKey={order => order._id}
				/>
			</div>
		)
	}

	// ADMIN TABLE COLUMNS
	const columns = [
		{ header: "Kod", accessor: (row: Order) => row._id },
		{
			header: "Tarih",
			accessor: (row: Order) => new Date(row.createdAt).toLocaleString("tr-TR")
		},
		{
			header: "Müşteri",
			accessor: (row: Order) => row.customer || row.email || "-"
		},
		{ header: "Tutar", accessor: (row: Order) => `${row.total}₺` },
		{
			header: "Ödeme Yöntemi",
			accessor: (row: Order) => row.paymentMethod,
			cell: (value: string) => paymentMethods[value as keyof typeof paymentMethods] || value
		},
		{
			header: "Ödeme Durumu",
			accessor: (row: Order) => row.paymentStatus,
			cell: (value: string, row: Order) => (
				<select
					value={value}
					onChange={e => updateOrderStatus(row._id, "paymentStatus", e.target.value)}
				>
					{Object.entries(paymentStatusLabels).map(([v, label]) => (
						<option key={v} value={v}>{label}</option>
					))}
				</select>
			)
		},
		{
			header: "Sipariş Durumu",
			accessor: (row: Order) => row.status,
			cell: (value: string, row: Order) => (
				<select
					value={value}
					onChange={e => updateOrderStatus(row._id, "status", e.target.value)}
				>
					{Object.entries(orderStatusLabels).map(([v, label]) => (
						<option key={v} value={v}>{label}</option>
					))}
				</select>
			)
		},
		{
			header: "Kargo Firması",
			accessor: (row: Order) => row.cargoCompany ?? "",
			cell: (value: string) => cargoCompanies[value as keyof typeof cargoCompanies] || value || "-"
		},
		{ header: "Kargo No", accessor: (row: Order) => row.cargoNo || "-" },
		{ header: "Adres", accessor: (row: Order) => row.address },
		{ header: "Ürün", accessor: (row: Order) => row.items?.length || 0 },
		{
			header: "Görünüm",
			accessor: (row: Order) => row._id,
			cell: (id: string) => (
				<a className={styles.detailBtn} href={`/my-account/orders/${id}`}>Detay</a>
			)
		}
	]

	return (
		<div className={styles.ordersTableWrap}>
			<Table<Order>
				columns={columns}
				data={orders}
				rowKey={order => order._id}
				noDataMessage="Sipariş bulunamadı."
			/>
		</div>
	)
}