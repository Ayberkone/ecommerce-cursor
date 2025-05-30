'use client'

import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { api } from "@/utils/api"
import styles from "./CategoriesBrandsPage.module.scss"
import { toast } from "sonner"

type Item = { _id: string, name: string }

function useFetchData(endpoint: string) {
	const [data, setData] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const fetchAll = React.useCallback(async () => {
		setLoading(true)
		try {
			const items = await api(endpoint, { showLoader: true })
			setData(items)
		} finally {
			setLoading(false)
		}
	}, [endpoint])
	useEffect(() => { fetchAll() }, [fetchAll])
	return { data, loading, refetch: fetchAll }
}

type CardProps = {
	title: string
	endpoint: string
	adminEndpoint: string
}

function CRUDCard({ title, endpoint, adminEndpoint }: CardProps) {
	const { data, loading, refetch } = useFetchData(endpoint)
	const [expanded, setExpanded] = useState(true)
	const [formValue, setFormValue] = useState("")
	const [editFormValue, setEditFormValue] = useState("")
	const [editId, setEditId] = useState<string | null>(null)

	// Edit form state
	const handleEdit = (item: Item) => {
		setEditId(item._id)
		setEditFormValue(item.name)
	}
	const handleCancel = () => {
		setEditId(null)
		setFormValue("")
		setEditFormValue("")
	}

	// Add or edit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formValue.trim() && !editFormValue.trim()) {
			toast.error("Boş olamaz")
			return
		}
		try {
			if (editId) {
				await api(`${adminEndpoint}/${editId}`, { method: "PUT", body: JSON.stringify({ name: editFormValue }), showLoader: true })
			} else {
				await api(adminEndpoint, { method: "POST", body: JSON.stringify({ name: formValue }), showLoader: true })
			}
			setFormValue("")
			setEditFormValue("")
			setEditId(null)
			refetch()
		} catch (e: any) {
			toast.error(e.message)
		}
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Silmek istediğinize emin misiniz?")) return
		await api(`${adminEndpoint}/${id}`, { method: "DELETE", showLoader: true })
		refetch()
	}

	return (
		<div className={`${styles.card} ${expanded ? styles.expanded : ""}`}>
			<div className={styles.cardHeader} onClick={() => setExpanded(x => !x)}>
				{expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
				<span style={{ marginLeft: 10 }}>{title}</span>
			</div>
			{expanded && (
				<div className={styles.cardContent}>
					<form className={styles.addForm} onSubmit={handleSubmit}>
						<input
							value={formValue}
							onChange={e => setFormValue(e.target.value)}
							placeholder={title + " adı"}
							maxLength={50}
							disabled={loading}
						/>
						<button type="submit" disabled={loading}>Ekle</button>
					</form>
					<div className={styles.tableWrap}>
						{loading
							? <div>Yükleniyor...</div>
							: (
								<table className={styles.table}>
									<thead>
										<tr>
											<th>#</th>
											<th>Ad</th>
											<th>İşlemler</th>
										</tr>
									</thead>
									<tbody>
										{data.map((item, i) => (
											<tr key={item._id}>
												<td>{i + 1}</td>
												<td>
													{editId === item._id
														? <input
															value={editFormValue}
															onChange={e => setEditFormValue(e.target.value)}
															maxLength={50}
														/>
														: item.name
													}
												</td>
												<td className={styles.actions}>
													{editId === item._id
														? (
															<>
																<button type="submit" className="btn btn-small btn-primary" onClick={handleSubmit}>Kaydet</button>
																<button type="button" className="btn btn-small btn-danger" onClick={handleCancel}>İptal</button>
															</>
														)
														: (
															<>
																<button type="button" className="btn btn-small btn-primary" onClick={() => handleEdit(item)}>Düzenle</button>
																<button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(item._id)}>Sil</button>
															</>
														)
													}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
					</div>
				</div>
			)}
		</div>
	)
}

export default function CategoriesBrandsPage() {
	return (
		<div className={styles.root}>
			<h1>Kategori & Marka Yönetimi</h1>
			<div className={styles.cards}>
				<CRUDCard title="Kategoriler" endpoint="/api/categories" adminEndpoint="/api/admin/categories" />
				<CRUDCard title="Markalar" endpoint="/api/brands" adminEndpoint="/api/admin/brands" />
			</div>
		</div>
	)
}