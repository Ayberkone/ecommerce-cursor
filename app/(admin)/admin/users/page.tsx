'use client'

import { useState, useEffect, useCallback } from "react"
import styles from "./AdminUsersPage.module.scss"
import { Table } from "@/components/Table/Table"
import { toast } from "sonner"
import { approveUser, rejectUser, reactivateUser, deleteUser, disableUser, enableUser, banUser } from "@/utils/admin/usersApi"
import { userColumns } from "@/components/Admin/User/Columns/AdminUserTableColumns"
import { pendingUserColumns } from "@/components/Admin/User/Columns/AdminPendingUserTableColumns"
import { rejectedUserColumns } from "@/components/Admin/User/Columns/AdminRejectedUserTableColumns"
import Tabs from "@/components/Tabs/Tabs"
import Modal from "@/components/Modal/Modal"
import RejectionModal from "@/components/Admin/RejectionModal/RejectionModal"
import { USER_TYPE_SELECT_OPTIONS } from "@/types/User"

const TABS = [
	{ key: 'pending', label: 'Onay Bekleyenler' },
	{ key: 'users', label: 'Tüm Kullanıcılar' },
	{ key: 'rejected', label: 'Reddedilenler' }
] as const

export default function AdminUsersPage() {
	const [tab, setTab] = useState<'users' | 'pending' | 'rejected'>('pending')
	const [userTypeFilter, setUserTypeFilter] = useState("")
	const [refresh, setRefresh] = useState(false)
	const [viewModalOpen, setViewModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<any>(null)
	const [rejectModalOpen, setRejectModalOpen] = useState(false)
	const [rejectLoading, setRejectLoading] = useState(false)

	const refetchData = useCallback(() => {
		setRefresh(r => !r) // Toggle refresh state to trigger re-fetch
	}, [])

	const handleRejectUser = useCallback((note: string) => {
		rejectUser(selectedUser._id, note)
			.then(() => {
				toast.success("Kullanıcı reddedildi!")
				refetchData()
				setRejectModalOpen(false)
			})
			.catch((e) => toast.error(e?.message || "Kullanıcı onaylanamadı"))
	}, [selectedUser?._id, refetchData])

	function handleUserAction(action: string, row: any) {
		switch (action) {
			case "delete":
				if (window.confirm(`Kullanıcıyı silmek istiyor musunuz?\n${row.firstName} ${row.lastName}`)) {
					deleteUser(row._id)
						.then(() => {
							toast.success("Kullanıcı silindi!")
							refetchData()
						})
						.catch(() => toast.error("Kullanıcı silinemedi"))
				}
				break
			case "reactivate":
				reactivateUser(row._id).then(() => {
					toast.success("Kullanıcı tekrar aktif edildi!")
					refetchData()
				}).catch((e) => toast.error(e?.message || "Kullanıcı onaylanamadı"))
				break
			case "approve":
				approveUser(row._id).then(() => {
					toast.success("Kullanıcı onaylandı!")
					refetchData()
				}).catch((e) => toast.error(e?.message || "Kullanıcı onaylanamadı"))
				break
			case "reject":
				setSelectedUser(row)
				setRejectModalOpen(true)
				break
			case "update":
				// Handle update action if needed
				toast.info("Güncelleme işlemi henüz desteklenmiyor")
				refetchData()
				break
			case "disable":
				disableUser(row._id)
					.then(() => {
						toast.success("Kullanıcı devre dışı bırakıldı!")
						refetchData()
					})
					.catch((e) => toast.error(e?.message || "Kullanıcı devre dışı bırakılamadı"))
				break
			case "enable":
				enableUser(row._id)
					.then(() => {
						toast.success("Kullanıcı tekrar etkinleştirildi!")
						refetchData()
					})
					.catch((e) => toast.error(e?.message || "Kullanıcı etkinleştirilemedi"))
				break
			case "ban":
				banUser(row._id)
					.then(() => {
						toast.success("Kullanıcı yasaklandı!")
						refetchData()
					})
					.catch((e) => toast.error(e?.message || "Kullanıcı yasaklanamadı"))
				break
			case "view":
				setSelectedUser(row)
				setViewModalOpen(true)
				break
			case "sendEmail":
				// Handle send email action if needed
				toast.info("E-posta gönderme henüz desteklenmiyor")
				break
			default:
				toast.error("Bilinmeyen işlem")
				break
		}
	}

	return (
		<>
			<h1>Kullanıcı Yönetimi</h1>
			<div className={styles.tabs}>
				<Tabs
					tabs={[...TABS]} // Pass a mutable copy of your tabs array
					activeTabKey={tab} // Pass the currently active tab key
					onTabChangeAction={(key: string) => setTab(key as 'users' | 'pending' | 'rejected')} // Cast key to correct type
					ariaLabel="Kullanıcı Yönetimi Sekmeleri" // Optional ARIA label for accessibility
				/>
			</div>
			<div className={styles.tabPanel}>
				{tab === "pending" && (
					<Table
						endpoint="/api/admin/users/pending-users"
						columns={pendingUserColumns}
						rowKey={u => u._id}
						className={styles.usersTable}
						noDataMessage="Onay bekleyen kullanıcı yok"
						initialSortField="createdAt"
						initialSortOrder="desc"
						searchPlaceholder="İsim, e-posta ile ara"
						onAction={handleUserAction}
						refresh={refresh}
					/>
				)}
				{tab === "users" && (
					<Table
						endpoint="/api/admin/users"
						params={userTypeFilter ? `type=${userTypeFilter}` : ""}
						columns={userColumns}
						rowKey={u => u._id}
						className={styles.usersTable}
						noDataMessage="Kullanıcı bulunamadı"
						initialSortField="createdAt"
						initialSortOrder="desc"
						searchPlaceholder="Ad, soyad veya e-posta ile ara"
						onAction={handleUserAction}
						refresh={refresh}
					>
						<div className={styles.usersFilters}>
							<label>
								Kullanıcı Tipi:
								<select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)}>
									{USER_TYPE_SELECT_OPTIONS.map(type => (
										<option key={type.key} value={type.key}>{type.label}</option>
									))}
								</select>
							</label>
						</div>
					</Table>
				)}
				{tab === "rejected" && (
					<Table
						endpoint="/api/admin/users/rejected-users"
						columns={rejectedUserColumns}
						rowKey={u => u._id}
						className={styles.usersTable}
						noDataMessage="Reddedilen kullanıcı yok"
						initialSortField="approvalDate"
						initialSortOrder="desc"
						searchPlaceholder="İsim, e-posta ile ara"
						onAction={handleUserAction}
						refresh={refresh}
					/>
				)}
			</div>
			{viewModalOpen && selectedUser && (
				<Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
					<div style={{ minWidth: 320 }}>
						<h2>Kullanıcı Detayları</h2>
						<table className={styles.detailsTable}>
							<tbody>
								{Object.entries(selectedUser)
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
			{rejectModalOpen && selectedUser && (
				<RejectionModal
					open={rejectModalOpen}
					onClose={() => setRejectModalOpen(false)}
					onConfirm={handleRejectUser}
					loading={rejectLoading}
				/>
			)}
		</>
	)
}