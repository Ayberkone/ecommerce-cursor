'use client'

import { useState, useEffect } from "react"
import styles from "./AdminUsersPage.module.scss"
import { Table } from "@/components/Table/Table"
import { toast } from "sonner"
import { approveUser, rejectUser, reactivateUser, deleteUser } from "@/utils/admin/usersApi"
import { userColumns } from "@/components/Admin/User/Columns/AdminUserTableColumns"
import { pendingUserColumns } from "@/components/Admin/User/Columns/AdminPendingUserTableColumns"
import { rejectedUserColumns } from "@/components/Admin/User/Columns/AdminRejectedUserTableColumns"
import Tabs from "@/components/Tabs/Tabs"

const USER_TYPES = [
	{ key: "", label: "Tümü" },
	{ key: "regular", label: "Normal" },
	{ key: "pharmacy", label: "Eczane" },
	{ key: "doctor", label: "Doktor" },
	{ key: "admin", label: "Admin" }
]

const TABS = [
	{ key: 'users', label: 'Tüm Kullanıcılar' },
	{ key: 'pending', label: 'Onay Bekleyenler' },
	{ key: 'rejected', label: 'Reddedilenler' },
] as const

export default function AdminUsersPage() {
	const [tab, setTab] = useState<'users' | 'pending' | 'rejected'>('users')
	const [userTypeFilter, setUserTypeFilter] = useState("")
	const [refresh, setRefresh] = useState(false)

	function refetchData() {
		setRefresh(r => !r) // Toggle refresh state to trigger re-fetch
	}

	function handleUserAction(action: string, row: any) {
		switch (action) {
			case "delete":
				if (window.confirm(`Kullanıcıyı silmek istiyor musunuz?\n${row.firstName} ${row.lastName}`)) {
					deleteUser(row._id)
						.then(() => {
							toast.success("Kullanıcı silindi!")
							refetchData()
							// Trigger data refresh - easiest: use a refetch function or change a state to trigger useEffect
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
				rejectUser(row._id).then(() => {
					toast.success("Kullanıcı reddedildi!")
					refetchData()
				}).catch((e) => toast.error(e?.message || "Kullanıcı onaylanamadı"))
				break
			case "update":
				// Handle update action if needed
				toast.info("Güncelleme işlemi henüz desteklenmiyor")
				refetchData()
				break
			case "view":
				// Handle view action if needed
				toast.info("Detay görüntüleme henüz desteklenmiyor")
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
		<main className={styles.adminUsersMain}>
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
									{USER_TYPES.map(type => (
										<option key={type.key} value={type.key}>{type.label}</option>
									))}
								</select>
							</label>
						</div>
					</Table>
				)}

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
		</main>
	)
}