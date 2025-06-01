'use client'

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronDown, ChevronRight, Plus, RefreshCcw, Trash, X } from 'lucide-react'
import { api } from "@/utils/api"
import styles from "./CRUDCard.module.scss"
import { toast } from "sonner"
import { useFormik } from "formik"
import * as Yup from "yup"
import Modal from "@/components/Modal/Modal"
import FormLayout from "@/components/FormLayout/FormLayout"
import ImageUploader from "@/components/ImageUploader/ImageUploader"

export type FieldDef = {
	key: string
	label: string
	type?: "text" | "number" | "image"
	required?: boolean
	maxLength?: number
}

export type CRUDCardProps = {
	title: string
	endpoint: string
	adminEndpoint: string
	fields: FieldDef[]
}

type Item = { [k: string]: any, _id: string }

function useFetchData(endpoint: string) {
	const [data, setData] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const fetchAll = useCallback(async () => {
		setLoading(true)
		try {
			const items = await api(endpoint, { showLoader: true })
			setData(Array.isArray(items) ? items : (items.data || []))
		} finally {
			setLoading(false)
		}
	}, [endpoint])
	useEffect(() => { fetchAll() }, [fetchAll])
	return { data, loading, refetch: fetchAll }
}

// Yup Schema
function buildValidationSchema(fields: FieldDef[]) {
	const shape: any = {}
	fields.forEach(f => {
		let rule: any
		if (f.type === "number") rule = Yup.number()
		else if (f.type === "image") rule = Yup.string()
		else rule = Yup.string()
		if (f.required) rule = rule.required("Gerekli alan")
		if (f.maxLength) rule = rule.max(f.maxLength, `En fazla ${f.maxLength} karakter`)
		shape[f.key] = rule
	})
	return Yup.object().shape(shape)
}
function getInitialValues(fields: FieldDef[], item?: Item) {
	const values: any = {}
	fields.forEach(f => {
		values[f.key] = (item && typeof item[f.key] !== "undefined") ? item[f.key] : (f.type === "number" ? 0 : "")
	})
	return values
}

export default function CRUDCard({ title, endpoint, adminEndpoint, fields }: CRUDCardProps) {
	const { data, loading, refetch } = useFetchData(endpoint)
	const [expanded, setExpanded] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editId, setEditId] = useState<string | null>(null)
	const [editInitial, setEditInitial] = useState<any | null>(null)

	const openAddModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		setEditId(null)
		setEditInitial(null)
		setModalOpen(true)
	}
	const handleEdit = (item: Item) => {
		setEditId(item._id)
		setEditInitial(getInitialValues(fields, item))
		setModalOpen(true)
	}
	const handleCancel = () => {
		setModalOpen(false)
		setEditId(null)
		setEditInitial(null)
	}

	const formik = useFormik({
		initialValues: editInitial || getInitialValues(fields),
		validationSchema: buildValidationSchema(fields),
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			try {
				if (editId) {
					await api(`${adminEndpoint}/${editId}`, { method: "PUT", body: JSON.stringify(values), showLoader: true })
					toast.success(`${title} güncellendi`)
				} else {
					await api(adminEndpoint, { method: "POST", body: JSON.stringify(values), showLoader: true })
					toast.success(`${title} eklendi`)
				}
				resetForm()
				setModalOpen(false)
				setEditId(null)
				setEditInitial(null)
				refetch()
			} catch (e: any) {
				toast.error(e.message)
			}
		}
	})

	// ----- Image Handlers -----
	function handleUpload(field: FieldDef, url: string) {
		formik.setFieldValue(field.key, url)
	}
	function removePhoto(field: FieldDef) {
		formik.setFieldValue(field.key, "")
	}

	const renderField = (field: FieldDef) => {
		if (field.type === "image") {
			return (
				<div className={styles.section} key={field.key}>
					<strong>{field.label}{field.required ? "*" : ""}</strong>
					<ImageUploader onUploadAction={(url: string) => handleUpload(field, url)} />
					{formik.values[field.key] && (
						<div style={{ position: 'relative', marginTop: 8, float: 'left' }}>
							<Image
								src={formik.values[field.key]}
								alt={field.label}
								width={110}
								height={110}
								style={{ borderRadius: 8, border: '1px solid #ddd', objectFit: 'cover' }}
							/>
							<button
								type="button"
								onClick={() => removePhoto(field)}
								style={{
									position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 2
								}}
								aria-label="Fotoğrafı kaldır"
							>
								<X size={16} />
							</button>
						</div>
					)}
					{formik.touched[field.key] && typeof formik.errors[field.key] === 'string' &&
						<div className={styles.error}>{String(formik.errors[field.key])}</div>
					}
				</div>
			)
		}

		return (
			<div className={styles.inputWrap} key={field.key}>
				<input
					name={field.key}
					type={field.type === "number" ? "number" : "text"}
					placeholder={field.label}
					value={formik.values[field.key]}
					onChange={formik.handleChange}
					maxLength={field.maxLength}
					required={field.required}
					disabled={loading}
				/>
				{formik.touched[field.key] && formik.errors[field.key] &&
					<div className={styles.error}>{String(formik.errors[field.key])}</div>
				}
			</div>
		)
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Silmek istediğinize emin misiniz?")) return
		await api(`${adminEndpoint}/${id}`, { method: "DELETE", showLoader: true })
		toast.success(`Silindi`)
		refetch()
	}

	return (
		<div className={`${styles.card} ${expanded ? styles.expanded : ""}`}>
			<div className={styles.cardHeader} onClick={() => setExpanded(x => !x)}>
				<span style={{ marginLeft: 10 }}>
					{title}
					{expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
				</span>
				<button className={styles.addBtn} onClick={openAddModal}><Plus size={18} /> Ekle</button>
			</div>
			{expanded && (
				<div className={styles.cardContent}>
					<Modal open={modalOpen} onClose={handleCancel}>
						<FormLayout title={title + (editId ? " Düzenle" : " Ekle")}>
							<form className={styles.modalForm} onSubmit={formik.handleSubmit}>
								{fields.map(renderField)}
								<div style={{ display: "flex", gap: 8, marginTop: 14 }}>
									<button type="submit" disabled={loading}>
										{editId ? "Kaydet" : "Ekle"}
									</button>
									<button type="button" onClick={handleCancel}>
										İptal
									</button>
								</div>
							</form>
						</FormLayout>
					</Modal>
					<div className={styles.tableWrap}>
						{loading
							? <div>Yükleniyor...</div>
							: (
								<table className={styles.table}>
									<thead>
										<tr>
											<th>#</th>
											{fields.map(f => f.type !== "image" && <th key={f.key}>{f.label}</th>)}
											<th className={styles.actions}>İşlemler</th>
										</tr>
									</thead>
									<tbody>
										{data.map((item, i) => (
											<tr key={item._id}>
												<td>{i + 1}</td>
												{fields.map(f => (
													f.type !== "image" && (
														<td key={f.key}>
															{item[f.key]}
														</td>
													)
												))}
												<td className={styles.actions}>
													<button
														type="button"
														className="btn btn-small btn-primary"
														onClick={() => handleEdit(item)}
														title="Düzenle"
													>
														<RefreshCcw size={16} />
													</button>
													<button
														type="button"
														className="btn btn-small btn-danger"
														onClick={() => handleDelete(item._id)}
														title="Sil"
													>
														<Trash size={16} />
													</button>
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