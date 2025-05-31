'use client'
import { useCallback } from "react"
import { Column, Table } from "@/components/Table/Table"
import { paymentStatusLabels, orderStatusLabels, paymentMethods, cargoCompanies } from '@/components/OrdersTable/ordersTableConfig'
import { toast } from "sonner"
import { api } from "@/utils/api"
import { Order } from "@/types/Order"

const columns: Column<Order>[] = [
	{ header: "Kod", accessor: (row: Order) => row._id, sortKey: "_id" },
	{
		header: "Tarih",
		accessor: (row: Order) => new Date(row.createdAt).toLocaleString("tr-TR"),
		sortKey: "createdAt"
	},
	{
		header: "Müşteri",
		accessor: (row: Order) => row.customer || row.email || "-",
		sortKey: "customer"
	},
	{ header: "Tutar", accessor: (row: Order) => `${row.total}₺`, sortKey: "total" },
	{
		header: "Ödeme Yöntemi",
		accessor: (row: Order) => row.paymentMethod,
		cell: (value: string) => paymentMethods[value as keyof typeof paymentMethods] || value,
		sortKey: "paymentMethod"
	},
	{
		header: "Ödeme Durumu",
		accessor: (row: Order) => row.paymentStatus,
		cell: (value: string, row: Order, triggerAction?: (action: string, row: any) => void) => (
			<select
				value={value}
				onChange={e => triggerAction?.("updatePaymentStatus", { ...row, value: e.target.value })}
			>
				{Object.entries(paymentStatusLabels).map(([v, label]) => (
					<option key={v} value={v}>{label}</option>
				))}
			</select>
		),
		sortKey: "paymentStatus"
	},
	{
		header: "Sipariş Durumu",
		accessor: (row: Order) => row.status,
		cell: (value: string, row: Order, triggerAction?: (action: string, row: any) => void) => (
			<select
				value={value}
				onChange={e => triggerAction?.("updateOrderStatus", { ...row, value: e.target.value })}
			>
				{Object.entries(orderStatusLabels).map(([v, label]) => (
					<option key={v} value={v}>{label}</option>
				))}
			</select>
		),
		sortKey: "status"
	},
	{
		header: "Kargo Firması",
		accessor: (row: Order) => row.cargoCompany ?? "",
		cell: (value: string) => cargoCompanies[value as keyof typeof cargoCompanies] || value || "-",
		sortKey: "cargoCompany"
	},
	{ header: "Kargo No", accessor: (row: Order) => row.cargoNo || "-", sortKey: "cargoNo" },
	{ header: "Adres", accessor: (row: Order) => row.address },
	{ header: "Ürün", accessor: (row: Order) => row.items?.length || 0 },
	{
		header: "Görünüm",
		accessor: (row: Order) => row._id,
		cell: (id: string) => (
			<a className='btn btn-outline' href={`/my-account/orders/${id}`}>Detay</a>
		)
	}
]

export default function AdminOrdersTable() {
	// Handler for inline actions (order/payment status change)
	const handleAction = useCallback(async (action: string, row: any) => {
		if (action === "updatePaymentStatus") {
			try {
				await api(`/api/admin/orders/${row._id}/paymentStatus`, {
					method: "PATCH",
					body: JSON.stringify({ paymentStatus: row.value }),
					showLoader: true,
				})
				toast.success("Ödeme durumu güncellendi!")
			} catch {
				toast.error("Ödeme durumu güncellenemedi.")
			}
		}
		if (action === "updateOrderStatus") {
			try {
				await api(`/api/admin/orders/${row._id}/status`, {
					method: "PATCH",
					body: JSON.stringify({ status: row.value }),
					showLoader: true,
				})
				toast.success("Sipariş durumu güncellendi!")
			} catch {
				toast.error("Sipariş durumu güncellenemedi.")
			}
		}
	}, [])

	return (
		<div>
			<h1>Siparişler</h1>
			<Table
				endpoint="/api/admin/orders"
				columns={columns}
				rowKey={order => order._id}
				noDataMessage="Sipariş bulunamadı."
				initialSortField="createdAt"
				initialSortOrder="desc"
				searchPlaceholder="İsim, e-posta, ürün ile ara"
				onAction={handleAction}
			/>
		</div>
	)
}