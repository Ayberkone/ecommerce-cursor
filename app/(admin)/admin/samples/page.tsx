'use client'

import { useState, useCallback } from "react"
import { Table } from "@/components/Table/Table"
import { toast } from "sonner"

interface SampleRequest {
	_id: string
	name: string
	email: string
	address: string
	status: "pending" | "approved" | "rejected"
	createdAt: string
	message?: string
}

interface SampleRequestColumn {
	header: string
	accessor: keyof SampleRequest | ((row: SampleRequest) => React.ReactNode)
	className?: string
}

// API actions
async function approveSample(sampleId: string) {
	const res = await fetch(`/api/admin/samples/${sampleId}/approve`, { method: "POST" })
	if (!res.ok) throw new Error(await res.text())
	return await res.json()
}
async function rejectSample(sampleId: string) {
	const res = await fetch(`/api/admin/samples/${sampleId}/reject`, { method: "POST" })
	if (!res.ok) throw new Error(await res.text())
	return await res.json()
}

export default function AdminSamples() {
	const [refresh, setRefresh] = useState(false)
	const triggerRefresh = useCallback(() => setRefresh(r => !r), [])

	// Define columns **inside** the component to access triggerRefresh
	const sampleRequestColumns: SampleRequestColumn[] = [
		{ header: "İsim", accessor: "name" },
		{ header: "Email", accessor: "email" },
		{ header: "Adres", accessor: "address" },
		{ header: "Mesaj", accessor: (row: SampleRequest) => row.message || "-" },
		{
			header: "Durum", accessor: (row: SampleRequest) => {
				switch (row.status) {
					case "pending": return "Bekliyor"
					case "approved": return "Onaylandı"
					case "rejected": return "Reddedildi"
					default: return ""
				}
			}
		},
		{ header: "Tarih", accessor: (row: SampleRequest) => new Date(row.createdAt).toLocaleString() },
		{
			header: "İşlemler", accessor: (row: SampleRequest) => {
				if (row.status !== "pending") return null
				return (
					<div style={{ display: "flex", gap: 8 }}>
						<button
							className="btn btn-success btn-xs"
							onClick={async () => {
								try {
									await approveSample(row._id)
									toast.success("Onaylandı!")
									triggerRefresh()
								} catch (err: any) {
									toast.error("Onaylanamadı: " + err.message)
								}
							}}
						>Onayla</button>
						<button
							className="btn btn-danger btn-xs"
							onClick={async () => {
								try {
									await rejectSample(row._id)
									toast.success("Reddedildi!")
									triggerRefresh()
								} catch (err: any) {
									toast.error("Reddedilemedi: " + err.message)
								}
							}}
						>Reddet</button>
					</div>
				)
			}
		}
	]

	return (
		<>
			<h1>Numune Talepleri</h1>
			<Table
				endpoint="/api/admin/samples"
				columns={sampleRequestColumns}
				rowKey={s => s._id}
				noDataMessage="Numune isteği bulunamadı"
				initialSortField="createdAt"
				initialSortOrder="desc"
				searchPlaceholder="İsim, e-posta ile ara"
				refresh={refresh}
			/>
		</>
	)
}