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
	type?: "text" | "number" | "image" | "textarea" | "select"
	required?: boolean
	maxLength?: number
	options?: { value: string | number; label: string }[]
}

export type CRUDCardProps = {
	title: string
	endpoint: string
	adminEndpoint: string
	fields: FieldDef[]
	renderTableCell?: (fieldKey: string, item: Item) => React.ReactNode;
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
			toast.error(err.message || `Veri (${endpoint}) çekilirken bir hata oluştu.`);
			setData([]);
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
		else if (f.type === "image" || f.type === "text" || f.type === "textarea" || f.type === "select") rule = Yup.string()
		else rule = Yup.string()
		if (f.required) rule = rule.required("Bu alan zorunludur.")
		if (f.maxLength) rule = rule.max(f.maxLength, `En fazla ${f.maxLength} karakter.`)
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

export default function CRUDCard({ title, endpoint, adminEndpoint, fields, renderTableCell }: CRUDCardProps) {
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
		formik.resetForm();
	}

	const formik = useFormik({
		initialValues: editInitial || getInitialValues(fields),
		validationSchema: buildValidationSchema(fields),
		enableReinitialize: true,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setSubmitting(true);
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
				toast.error(e.message || "Bir hata oluştu.");
			} finally {
				setSubmitting(false);
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
			name: field.key,
			value: formik.values[field.key],
			onChange: formik.handleChange,
			maxLength: field.maxLength,
			required: field.required,
			disabled: formik.isSubmitting || loading,
			className: styles.inputWrap
		};

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
							type="number"
							placeholder={field.label}
							{...commonProps}
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
							placeholder={field.label}
							rows={4}
							{...commonProps}
						/>
						{formik.touched[field.key] && formik.errors[field.key] &&
							<div className={styles.error}>{String(formik.errors[field.key])}</div>
						}
					</div>
				);
			case "select":
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<select
							id={field.key}
							{...commonProps}
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
				);
			case "text":
			default:
				return (
					<div className={styles.inputWrap} key={field.key}>
						<label htmlFor={field.key}>{field.label}{field.required ? "*" : ""}</label>
						<input
							id={field.key}
							type="text"
							placeholder={field.label}
							{...commonProps}
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
			toast.error(e.message || "Silme işlemi başarısız oldu.");
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
									<button type="submit" disabled={formik.isSubmitting || loading}>
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
										{fields.map(f => f.type !== "image" ? <th key={f.key}>{f.label}</th> : null)}
										<th className={styles.actions}>İşlemler</th>
									</tr>
								</thead>
								<tbody>
									{data.map((item, i) => (
										<tr key={item._id}>
											<td>{i + 1}</td>
											{fields.map(f =>
												f.type !== "image" ? (
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