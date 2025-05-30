'use client'

import { useFormik } from 'formik'
import { productSchema } from '@/utils/productValidation'
import { ProductFormValues, Category, Brand } from '@/types/Product'
import { useEffect, useState } from 'react'
import ImageUploader from '@/components/ImageUploader/ImageUploader'
import styles from './ProductForm.module.scss'
import { api } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { fetchBrands, fetchCategories, fetchProduct } from "@/utils/admin/adminApi"

export default function ProductForm({ params }: { params: { id?: string } }) {
	const router = useRouter()
	const [categories, setCategories] = useState<Category[]>([])
	const [brands, setBrands] = useState<Brand[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [editMode, setEditMode] = useState(false)

	// Default initial values
	const initialValues: ProductFormValues = {
		name: '',
		seoTitle: '',
		description: { normal: '', mini: '' },
		proDescription: { normal: '', mini: '' },
		keywords: '',
		videoLink: '',
		price: { regular: 0, pro: 0, storage: 0 },
		isTaxIncluded: true,
		taxRate: 10,
		stockQuantity: 1000,
		barcode: '',
		category: '',
		brand: '',
		photoUrls: [],
		documentUrl: '',
	}

	const [formValues, setFormValues] = useState<ProductFormValues>(initialValues)

	// Fetch categories/brands and product if editing
	useEffect(() => {
		async function load() {
			try {
				const [cats, brs, product] = await Promise.all([
					fetchCategories(),
					fetchBrands(),
					params.id && params.id !== 'new' ? fetchProduct(params.id as string) : Promise.resolve(null)
				])
				setCategories(cats)
				setBrands(brs)
				if (product) {
					setEditMode(true)
					setFormValues(product)
				}
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [params.id])

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: formValues,
		validationSchema: productSchema,
		onSubmit: async values => {
			setSubmitting(true)
			const _valuesToSubmit = {
				...values,
				keywords: values.keywords
					.split(",")
					.map(k => k.trim())
					.filter(Boolean)
			}
			try {
				if (editMode) {
					await api(`/api/admin/products/${params.id}`, {
						method: 'PUT',
						body: JSON.stringify(_valuesToSubmit),
						showLoader: true
					})
				} else {
					await api('/api/admin/products', {
						method: 'POST',
						body: JSON.stringify(_valuesToSubmit),
						showLoader: true
					})
				}
				router.push('/api/admin/products')
			} catch (e: any) {
				alert(e.message || 'Hata oluştu!')
			} finally {
				setSubmitting(false)
			}
		}
	})

	function handleUploadPhoto(url: string) {
		formik.setFieldValue('photoUrls', [...formik.values.photoUrls, url])
	}
	function removePhoto(url: string) {
		formik.setFieldValue('photoUrls', formik.values.photoUrls.filter(p => p !== url))
	}

	if (loading) return <div>Yükleniyor...</div>

	return (
		<form className={styles.productForm} onSubmit={formik.handleSubmit}>
			<h1>{editMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h1>
			<div className={styles.sectionRow}>
				<label>Adı*<input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={formik.errors.name && formik.touched.name ? styles.errorInput : ''} /></label>
				{formik.touched.name && formik.errors.name && <div className={styles.err}>{formik.errors.name}</div>}
			</div>
			<div className={styles.sectionRow}>
				<label>SEO Başlığı*<input name="seoTitle" value={formik.values.seoTitle} onChange={formik.handleChange} onBlur={formik.handleBlur} className={formik.errors.seoTitle && formik.touched.seoTitle ? styles.errorInput : ''} /></label>
				{formik.touched.seoTitle && formik.errors.seoTitle && <div className={styles.err}>{formik.errors.seoTitle}</div>}
			</div>
			<div className={styles.sectionRow}>
				<div>
					<label>Kısa Açıklama*<input name="description.mini" value={formik.values.description.mini} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
					{formik.touched.description?.mini && formik.errors.description?.mini && <div className={styles.err}>{formik.errors.description.mini}</div>}
				</div>
			</div>
			<div className={styles.sectionRow}>
				<div>
					<label>Açıklama*<textarea rows={20} name="description.normal" value={formik.values.description.normal} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
					{formik.touched.description?.normal && formik.errors.description?.normal && <div className={styles.err}>{formik.errors.description.normal}</div>}
				</div>
			</div>
			<div className={styles.sectionRow}>
				<div>
					<label>Pro Kısa Açıklama*<input name="proDescription.mini" value={formik.values.proDescription.mini} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
					{formik.touched.proDescription?.mini && formik.errors.proDescription?.mini && <div className={styles.err}>{formik.errors.proDescription.mini}</div>}
				</div>
			</div>
			<div className={styles.sectionRow}>
				<div>
					<label>Pro Açıklama*<textarea rows={20} name="proDescription.normal" value={formik.values.proDescription.normal} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
					{formik.touched.proDescription?.normal && formik.errors.proDescription?.normal && <div className={styles.err}>{formik.errors.proDescription.normal}</div>}
				</div>
			</div>
			<div className={styles.sectionRow}>
				<label>
					Anahtar Kelimeler (virgül ile ayrılmış)*
					<input name="keywords" value={formik.values.keywords} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.keywords && formik.errors.keywords && <div className={styles.err}>{formik.errors.keywords}</div>}
				</label>
			</div>
			<div className={styles.sectionRow}>
				<label>
					Video Linki
					<input name="videoLink" value={formik.values.videoLink} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.videoLink && formik.errors.videoLink && <div className={styles.err}>{formik.errors.videoLink}</div>}
				</label>
			</div>
			<div className={styles.sectionRow}>
				<label>Fiyat (Normal)* <input name="price.regular" type="number" value={formik.values.price.regular} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
				<label>Fiyat (Pro)* <input name="price.pro" type="number" value={formik.values.price.pro} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
				<label>Fiyat (Depo)* <input name="price.storage" type="number" value={formik.values.price.storage} onChange={formik.handleChange} onBlur={formik.handleBlur} /></label>
			</div>
			<div className={styles.sectionRow}>
				<label>
					KDV Oranı*
					<input name="taxRate" type="number" value={formik.values.taxRate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.taxRate && formik.errors.taxRate && <div className={styles.err}>{formik.errors.taxRate}</div>}
				</label>
				<label>
					KDV Dahil mi?
					<input type="checkbox" name="isTaxIncluded" checked={formik.values.isTaxIncluded} onChange={formik.handleChange} />
				</label>
				<div></div>
			</div>
			<div className={styles.sectionRow}>
				<label>
					Stok Adedi*
					<input name="stockQuantity" type="number" value={formik.values.stockQuantity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.stockQuantity && formik.errors.stockQuantity && <div className={styles.err}>{formik.errors.stockQuantity}</div>}
				</label>
				<label>
					Barkod*
					<input name="barcode" value={formik.values.barcode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.barcode && formik.errors.barcode && <div className={styles.err}>{formik.errors.barcode}</div>}
				</label>
			</div>
			<div className={styles.sectionRow}>
				<label>
					Kategori*
					<select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						<option value="">Kategori Seçin</option>
						{categories.map(cat => (
							<option key={cat._id} value={cat._id}>{cat.name}</option>
						))}
					</select>
					{formik.touched.category && formik.errors.category && <div className={styles.err}>{formik.errors.category}</div>}
				</label>
				<label>
					Marka*
					<select name="brand" value={formik.values.brand} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						<option value="">Marka Seçin</option>
						{brands.map(br => (
							<option key={br._id} value={br._id}>{br.name}</option>
						))}
					</select>
					{formik.touched.brand && formik.errors.brand && <div className={styles.err}>{formik.errors.brand}</div>}
				</label>
			</div>
			<div className={styles.sectionRow}>
				<label>
					Belgeler (PDF veya link)
					<input name="documentUrl" value={formik.values.documentUrl} onChange={formik.handleChange} onBlur={formik.handleBlur} />
					{formik.touched.documentUrl && formik.errors.documentUrl && <div className={styles.err}>{formik.errors.documentUrl}</div>}
				</label>
			</div>
			<div className={styles.section}>
				<strong>Fotoğraflar*</strong>
				<ImageUploader onUploadAction={handleUploadPhoto} />
				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
					{formik.values.photoUrls.map(url =>
						<div key={url} style={{ position: 'relative' }}>
							<Image
								src={url}
								alt="Ürün fotoğrafı"
								width={110}
								height={110}
								style={{ borderRadius: 8, border: '1px solid #ddd', objectFit: 'cover' }}
							/>
							<button type="button" onClick={() => removePhoto(url)} style={{
								position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer'
							}}>✕</button>
						</div>
					)}
				</div>
				{formik.touched.photoUrls && typeof formik.errors.photoUrls === 'string' && <div className={styles.err}>{formik.errors.photoUrls}</div>}
			</div>
			<div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
				<button type="submit" disabled={submitting}>{editMode ? 'Güncelle' : 'Ekle'}</button>
				<button type="button" onClick={() => router.push('/admin/products')}>Vazgeç</button>
			</div>
		</form>
	)
}