'use client'

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/legacy/image"
import { ChevronDown, ChevronRight, Plus, RefreshCcw, Trash, X } from 'lucide-react'
import { api } from "@/utils/api"
import styles from "./CRUDCard.module.scss"
import { toast } from "sonner"
import { useFormik } from "formik"
import * as Yup from "yup"
import Modal from "@/components/Modal/Modal"
import FormLayout from "@/components/FormLayout/FormLayout"
import ImageUploader from "@/components/ImageUploader/ImageUploader"
import Editor from "react-simple-wysiwyg"

export type FieldDef = {
	key: string
	label: string
	type?: "text" | "number" | "image" | "textarea" | "select" | "Editor"
	required?: boolean
	maxLength?: number
	options?: { value: string | number, label: string }[]
}

export type CRUDCardProps = {
	title: string
	endpoint: string
	adminEndpoint: string
	fields: FieldDef[]
	renderTableCell?: (fieldKey: string, item: Item) => React.ReactNode
}

type Item = { [k: string]: any, _id: string }

function useFetchData(endpoint: string) {
	const [data, setData] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const fetchAll = useCallback(async () => {
		setLoading(true)
		try {
			const res = await api(endpoint, { showLoader: false })
			setData(Array.isArray(res) ? res : (res.data || []))
		} catch (err: any) {
			toast.error(err.message || `Veri (${endpoint}) çekilirken bir hata oluştu.`)
			setData([])
		} finally {
			setLoading(false)
		}
	}, [endpoint])
	useEffect(() => { fetchAll() }, [fetchAll])
	return { data, loading, refetch: fetchAll }
}

function buildValidationSchema(fields: FieldDef[]) {
	const shape: any = {}
	fields.forEach(f => {
		let rule: any
		if (f.type === "number") rule = Yup.number().typeError("Sayı olmalı")
		else if (f.type === "image" || f.type === "text" || f.type === "textarea" || f.type === "select" || f.type === "Editor") rule = Yup.string()
		else rule = Yup.string()

		if (f.type) {
			if (f.required) rule = rule.required("Bu alan zorunludur.")
			if (f.maxLength) rule = rule.max(f.maxLength, `En fazla ${f.maxLength} karakter.`)
		}
		shape[f.key] = rule
	})
	return Yup.object().shape(shape)
}

function getInitialValues(fields: FieldDef[], item?: Item) {
	const values: any = {}
	fields.forEach(f => {
		const itemValue = item ? item[f.key] : undefined
		if (f.type === "Editor") {
			values[f.key] = (itemValue !== undefined && itemValue !== null) ? String(itemValue) : ""
		} else if (f.type === "number") {
			values[f.key] = (itemValue !== undefined && itemValue !== null) ? Number(itemValue) : 0
		} else {
			values[f.key] = (itemValue !== undefined && itemValue !== null) ? String(itemValue) : ""
		}
	})
	return values
}

export default function CRUDCard({ title, endpoint, adminEndpoint, fields, renderTableCell }: CRUDCardProps) {
	const { data, loading, refetch } = useFetchData(endpoint)
	const [expanded, setExpanded] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editId, setEditId] = useState<string | null>(null)
	const [editInitial, setEditInitial] = useState<any | null>(null)

	const openAddModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		setEditId(null)
		setEditInitial(null) // Will be set by Formik's initialValues with getInitialValues(fields)
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
		formik.resetForm({ values: getInitialValues(fields) }) // Reset to default initial values
	}

	const formik = useFormik({
		initialValues: editInitial || getInitialValues(fields),
		validationSchema: buildValidationSchema(fields),
		enableReinitialize: true,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setSubmitting(true)
			try {
				if (editId) {
					await api(`${adminEndpoint}/${editId}`, { method: "PUT", body: JSON.stringify(values), showLoader: true })
					toast.success(`${title} güncellendi`)
				} else {
					await api(adminEndpoint, { method: "POST", body: JSON.stringify(values), showLoader: true })
					toast.success(`${title} eklendi`)
				}
				resetForm({ values: getInitialValues(fields) }) // Reset to default initial values
				setModalOpen(false)
				setEditId(null)
				setEditInitial(null)
				refetch()
			} catch (e: any) {
				toast.error(e.message || "Bir hata oluştu.")
			} finally {
				setSubmitting(false)
			}
		}
	})

	function handleUpload(field: FieldDef, url: string) {
		formik.setFieldValue(field.key, url)
	}
	function removePhoto(field: FieldDef) {
		formik.setFieldValue(field.key, "")
	}

	const renderField = (field: FieldDef) => {
		const commonProps = {
			// name: field.key, // name is handled differently or not needed for some custom components
			// value: formik.values[field.key], // value is handled per type
			onChange: formik.handleChange,
			maxLength: field.maxLength,
			required: field.required,
			disabled: formik.isSubmitting || loading,
		}

		switch (field.type) {
			case "image":
				return (
					<div className={styles.imageUploadSection} key={field.key}>
						<strong>{field.label}{field.required ? "*" : ""}</strong>
						<ImageUploader onUploadAction={(url: string) => handleUpload(field, url)} />
						{formik.values[field.key] && (
							<div className={styles.imagePreviewContainer}>
								<div>
									<Image
										src={formik.values[field.key]}
										alt={field.label}
										width={110}
										height={110}
										className={styles.imagePreview}
									/>
									<button
										type="button"
										onClick={() => removePhoto(field)}
										className={styles.removeImageBtn}
										aria-label="Fotoğrafı kaldır"
									>
										<X size={16} />
									</button>
								</div>
							</div>
						)}
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				)
			case "number":
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<input
							id={field.key}
							name={field.key}
							type="number"
							value={formik.values[field.key]}
							placeholder={field.label}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={commonProps.disabled}
							required={commonProps.required}
						/>
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				)
			case "textarea":
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<textarea
							id={field.key}
							name={field.key}
							value={formik.values[field.key]}
							placeholder={field.label}
							rows={4}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							maxLength={commonProps.maxLength}
							required={commonProps.required}
							disabled={commonProps.disabled}
						/>
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				)
			case "select":
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<select
							id={field.key}
							name={field.key}
							value={formik.values[field.key]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={commonProps.disabled}
							required={commonProps.required}
						>
							<option value="">Seçiniz...</option>
							{field.options?.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				)
			case "Editor":
				const editorFieldName = field.key
				const currentFieldValue = formik.values[field.key]

				// Nested touched and errors
				const touchedNormal = formik.touched[field.key] && (formik.touched[field.key] as any)
				const errorNormal = formik.errors[field.key] && (formik.errors[field.key] as any)

				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={editorFieldName}>{field.label}{field.required ? "*" : ""}</label>
						<Editor
							value={currentFieldValue}
							onChange={(e: any) => {
								formik.setFieldValue(editorFieldName, e.target.value)
							}}
							onBlur={() => {
								formik.setFieldTouched(editorFieldName, true, true)
							}}
							disabled={commonProps.disabled}
							style={{ minHeight: '200px' }}
						/>
						{touchedNormal && errorNormal &&
							<div className={styles.error}>{String(errorNormal)}</div>
						}
					</div>
				)
			case "text":
			default:
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<input
							id={field.key}
							name={field.key}
							type="text"
							value={formik.values[field.key]}
							placeholder={field.label}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							maxLength={commonProps.maxLength}
							required={commonProps.required}
							disabled={commonProps.disabled}
						/>
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				)
		}
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Bu öğeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) return
		try {
			await api(`${adminEndpoint}/${id}`, { method: "DELETE", showLoader: true })
			toast.success(`${title} başarıyla silindi.`)
			refetch()
		} catch (e: any) {
			toast.error(e.message || "Silme işlemi başarısız oldu.")
		}
	}

	return (
		<div className={`${styles.card} ${expanded ? styles.expanded : ""}`}>
			<div className={styles.cardHeader} onClick={() => setExpanded(x => !x)}>
				<span>
					{title}
					{expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
				</span>
				<button className={styles.addBtn} onClick={openAddModal} type="button">
					<Plus size={18} /> Ekle
				</button>
			</div>
			{expanded && (
				<div className={styles.cardContent}>
					<Modal open={modalOpen} onClose={handleCancel}>
						<FormLayout title={title + (editId ? " Düzenle" : " Ekle")}>
							<form className={styles.modalForm} onSubmit={formik.handleSubmit}>
								{fields.map(renderField)}
								<div className={styles.modalActions}>
									<button type="submit" disabled={formik.isSubmitting || loading || !formik.isValid || !formik.dirty}>
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
						{loading ? (
							<div className={styles.loadingMessage}>Yükleniyor...</div>
						) : data.length === 0 ? (
							<div className={styles.noDataMessage}>Henüz hiç veri bulunmamaktadır. Yeni bir {title.toLowerCase()} ekleyin!</div>
						) : (
							<table className={styles.table}>
								<thead>
									<tr>
										<th>#</th>
										{fields.map(f => (f.type !== "image" && f.type !== "Editor") ? <th key={f.key}>{f.label}</th> : null)}
										<th className={styles.actions}>İşlemler</th>
									</tr>
								</thead>
								<tbody>
									{data.map((item, i) => (
										<tr key={item._id}>
											<td>{i + 1}</td>
											{fields.map(f =>
												(f.type !== "image" && f.type !== "Editor") ? (
													<td key={f.key}>
														{renderTableCell ? renderTableCell(f.key, item) : (item[f.key] || '-')}
													</td>
												) : null
											)}
											<td className={styles.actions}>
												<button
													type="button"
													className={styles.editBtn}
													onClick={() => handleEdit(item)}
													title="Düzenle"
												>
													<RefreshCcw size={16} />
												</button>
												<button
													type="button"
													className={styles.deleteBtn}
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