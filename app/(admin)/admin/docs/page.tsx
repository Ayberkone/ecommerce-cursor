'use client'

import { useEffect, useState } from "react"
import { Table, Column } from "@/components/Table/Table"
import Modal from "@/components/Modal/Modal"
import { Pencil, Trash, Plus, UploadCloud } from "lucide-react"
import { api } from "@/utils/api"

type Doc = {
	_id: string
	title: string
	category: string
	type: string
	url: string
	uploadedAt: string
}

const CATEGORIES = [
	"Gengigel",
	"Klinik Deneyimler",
	"Arastirmalar"
]

export default function AdminDocsPage() {
	const [refresh, setRefresh] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [editDoc, setEditDoc] = useState<Doc | null>(null)
	const [form, setForm] = useState<{ title: string; category: string; file: File | null }>({ title: "", category: "", file: null })
	const [loading, setLoading] = useState(false)

	// --- Table Columns ---
	const columns: Column<Doc>[] = [
		{ header: "Başlık", accessor: "title", sortKey: "title" },
		{ header: "Kategori", accessor: "category", sortKey: "category" },
		{ header: "Tür", accessor: "type", sortKey: "type" },
		{ header: "Yüklenme", accessor: row => new Date(row.uploadedAt).toLocaleDateString(), sortKey: "uploadedAt" },
		{
			header: "İşlemler", className: "actions", accessor: () => "", cell: (_val, row) => (
				<>
					<button className="btn btn-primary btn-small" onClick={() => handleEdit(row)} title="Düzenle">
						<Pencil size={18} />
					</button>
					<button className="btn btn-danger btn-small" onClick={() => handleDelete(row)} title="Sil">
						<Trash size={18} />
					</button>
				</>
			)
		}
	]

	// --- Handlers ---
	function handleEdit(doc: Doc) {
		setEditDoc(doc)
		setForm({ title: doc.title, category: doc.category, file: null })
		setModalOpen(true)
	}

	async function handleDelete(doc: Doc) {
		if (!window.confirm(`Silinsin mi?\n${doc.title}`)) return
		setLoading(true)
		await api(`/api/docs/${doc._id}`, { method: "DELETE" })
		setLoading(false)
		setRefresh(x => !x)
	}

	async function handleSave(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		// Edit title/category only
		await api(`/api/docs/${editDoc?._id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: form.title, category: form.category })
		})
		setLoading(false)
		setModalOpen(false)
		setRefresh(x => !x)
	}

	return (
		<div>
			<div>
				<h1>Döküman Yönetimi</h1>
			</div>
			<Table<Doc>
				endpoint="/api/docs"
				columns={columns}
				rowKey={(row) => row._id}
				noDataMessage="Henüz döküman yok"
				searchPlaceholder="Başlık/kategori ara..."
				initialSortField="uploadedAt"
				initialSortOrder="desc"
				refresh={refresh}
				pageSizeOptions={[10, 20, 50]}
			/>
			{/* --- Add/Edit Modal --- */}
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<form onSubmit={handleSave}>
					<h2>{editDoc ? "Düzenle" : "Yeni Döküman"}</h2>
					<label>
						Başlık
						<input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
					</label>
					<label>
						Kategori
						<select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
							<option value="">Seçin</option>
							{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
						</select>
					</label>
					<button type="submit" disabled={loading}>
						<UploadCloud size={18} style={{ marginRight: 8 }} />
						{loading ? "Kaydediliyor..." : "Kaydet"}
					</button>
				</form>
			</Modal>
		</div>
	)
}