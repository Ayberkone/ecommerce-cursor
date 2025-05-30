'use client'

import { useState, useEffect } from "react"
import styles from "./AdminUsersPage.module.scss"
import { Table } from "@/components/Table/Table"
import { toast } from "sonner"
import { approveUser, rejectUser, reactivateUser } from "@/utils/admin/usersApi"
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

	// Listen to actions triggered from Table cells
	useEffect(() => {
		function handleApprove(e: any) {
			approveUser(e.detail._id).then(() => toast.success("Kullanıcı onaylandı!"))
		}
		function handleReject(e: any) {
			rejectUser(e.detail._id).then(() => toast.success("Kullanıcı reddedildi!"))
		}
		function handleReactivate(e: any) {
			reactivateUser(e.detail._id).then(() => toast.success("Kullanıcı tekrar inceleniyor!"))
		}
		window.addEventListener("admin:approve", handleApprove)
		window.addEventListener("admin:reject", handleReject)
		window.addEventListener("admin:reactivate", handleReactivate)
		return () => {
			window.removeEventListener("admin:approve", handleApprove)
			window.removeEventListener("admin:reject", handleReject)
			window.removeEventListener("admin:reactivate", handleReactivate)
		}
	}, [])

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
					/>
				)}
			</div>
		</main>
	)
}