// app/admin/notifications/page.tsx

'use client'

import { useState } from "react"
import { Table, Column } from "@/components/Table/Table"
import { markAllNotificationsRead, markNotificationRead } from "@/utils/admin/notifsApi"
import { toast } from "sonner"
import { AdminNotification, notificationTypeLabels } from "@/types/AdminNotification"
import { BookCheck, Eye } from "lucide-react"
import Modal from "@/components/Modal/Modal"
import styles from "./AdminNotifications.module.scss"

const notificationColumns: Column<AdminNotification>[] = [
	{
		header: "Tip",
		accessor: "type",
		cell: (type) => notificationTypeLabels[type] || type
	},
	{ header: "Mesaj", accessor: "message", className: "column-ellipsis" },
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
		className: "actions",
		cell: (_id, row, triggerAction) =>
			<>
				{!row.read ? (
					<button
						className="btn btn-success btn-small"
						onClick={() => triggerAction("markRead", row)}
						title="Okundu Yap"
					>
						<BookCheck size={16} />
					</button>
				) : null}
				<button
					className="btn btn-primary btn-small"
					onClick={() => triggerAction("view", row)}
					title="İncele"
				>
					<Eye size={16} />
				</button>
			</>
	}
]

export default function AdminNotificationsPage() {
	const [refresh, setRefresh] = useState(false)
	const [viewModalOpen, setViewModalOpen] = useState(false)
	const [selectedNotif, setSelectedNotif] = useState<any>(null)


	const handleAction = async (action: string, row: AdminNotification) => {
		switch (action) {
			case "view":
				setSelectedNotif(row)
				setViewModalOpen(true)
				break
			case "markRead":
				await markNotificationRead(row._id)
				toast.success("Bildirim okundu olarak işaretlendi.")
				setRefresh(r => !r)
				break
			default:
				toast.error("Bilinmeyen işlem")
				break
		}
	}

	const handleMarkAllRead = async () => {
		await markAllNotificationsRead()
		toast.success("Tüm bildirimler okundu olarak işaretlendi.")
		setRefresh(r => !r)
	}

	return (
		<>
			<h1>Bildirimler</h1>
			<div>
				<button onClick={handleMarkAllRead} className="btn btn-primary">Tümünü Okundu Olarak İşaretle</button>
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
			{viewModalOpen && selectedNotif && (
				<Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
					<div style={{ minWidth: 320 }}>
						<h2>Bildirim Detayları</h2>
						<table className={styles.detailsTable}>
							<tbody>
								{Object.entries(selectedNotif)
									.filter(([key]) => key !== "password" && key !== "__v")
									.map(([key, value]) => (
										<tr key={key}>
											<td>{key}</td>
											<td>
												{typeof value === "boolean"
													? value ? "Evet" : "Hayır"
													: value && typeof value === "object"
														? JSON.stringify(value, null, 2)
														: String(value)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
						<button style={{ marginTop: 16 }} className="btn" onClick={() => setViewModalOpen(false)}>Kapat</button>
					</div>
				</Modal>
			)}
		</>
	)
}