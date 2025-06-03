// app/admin/notifications/page.tsx

'use client'

import { useState } from "react"
import { Table, Column } from "@/components/Table/Table"
import { markAllNotificationsRead, markNotificationRead } from "@/utils/admin/notifsApi"
import { toast } from "sonner"

type AdminNotification = {
	_id: string
	type: string
	title?: string
	message: string
	createdAt: string
	read: boolean
}

const notificationColumns: Column<AdminNotification>[] = [
	{ header: "Tip", accessor: "type" },
	{ header: "Başlık", accessor: "title" },
	{ header: "Mesaj", accessor: "message" },
	{
		header: "Tarih",
		accessor: (row) => new Date(row.createdAt).toLocaleString(),
		sortKey: "createdAt"
	},
	{
		header: "Durum",
		accessor: "read",
		cell: (read) =>
			read
				? <span style={{ color: "#aaa" }}>Okundu</span>
				: <span style={{ color: "#2c7" }}>Yeni</span>
	},
	{
		header: "İşlem",
		accessor: (row) => row._id,
		cell: (_id, row, triggerAction) =>
			!row.read ? (
				<button
					style={{ fontSize: 12, padding: "4px 8px" }}
					onClick={() => triggerAction("markRead", row)}
				>
					Okundu Yap
				</button>
			) : null
	}
]

export default function AdminNotificationsPage() {
	const [refresh, setRefresh] = useState(false)

	const handleAction = async (action: string, row: AdminNotification) => {
		if (action === "markRead") {
			await markNotificationRead(row._id)
			toast.success("Bildirim okundu olarak işaretlendi.")
			setRefresh(r => !r)
		}
	}

	const handleMarkAllRead = async () => {
		await markAllNotificationsRead()
		toast.success("Tüm bildirimler okundu olarak işaretlendi.")
		setRefresh(r => !r)
	}

	return (
		<main>
			<h1>Bildirimler</h1>
			<div style={{ marginBottom: 12 }}>
				<button onClick={handleMarkAllRead}>Tümünü Okundu Olarak İşaretle</button>
			</div>
			<Table<AdminNotification>
				endpoint="/api/admin/notifications"
				columns={notificationColumns}
				rowKey={n => n._id}
				noDataMessage="Hiç bildirim yok"
				initialSortField="createdAt"
				initialSortOrder="desc"
				searchPlaceholder="Başlık, mesaj ile ara"
				onAction={handleAction}
				refresh={refresh}
				responseDataKey="notifications"
			/>
		</main>
	)
}