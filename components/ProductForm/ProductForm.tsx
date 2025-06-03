'use client'

import { useFormik } from 'formik'
import { productSchema } from '@/utils/productValidation'
import { ProductFormValues, Category, Brand, Collection, Product } from '@/types/Product'
import { useEffect, useState } from 'react'
import ImageUploader from '@/components/ImageUploader/ImageUploader'
import styles from './ProductForm.module.scss'
import { api } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { fetchBrands, fetchCategories, fetchProduct, fetchCollections } from "@/utils/admin/adminApi"
import Select from 'react-select'

const initialValues: ProductFormValues = {
	_id: '',
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
	collections: [],
}

export default function ProductForm({ product }: { product: Product }) {
	const router = useRouter()
	const [categories, setCategories] = useState<Category[]>([])
	const [collections, setCollections] = useState<Collection[]>([])
	const [brands, setBrands] = useState<Brand[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [editMode, setEditMode] = useState(false)

	const [formValues, setFormValues] = useState<ProductFormValues>(initialValues)

	useEffect(() => {
		async function load() {
			try {
				const [cats, brs, colls] = await Promise.all([
					fetchCategories(),
					fetchBrands(),
					fetchCollections(),
				])
				setCategories(cats)
				setBrands(brs)
				setCollections(colls)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	useEffect(() => {
		if (product) {
			setEditMode(true)
			setFormValues({
				_id: product._id,
				name: product.name,
				seoTitle: product.seoTitle ?? "",
				description: {
					normal: product.description?.normal ?? "",
					mini: product.description?.mini ?? ""
				},
				proDescription: {
					normal: product.proDescription?.normal ?? "",
					mini: product.proDescription?.mini ?? ""
				},
				// *** This is the KEY: join the array ***
				keywords: Array.isArray(product.keywords) ? product.keywords.join(", ") : (product.keywords || ""),
				videoLink: product.videoLink ?? "",
				price: {
					regular: product.price?.regular ?? 0,
					pro: product.price?.pro ?? 0,
					storage: product.price?.storage ?? 0,
				},
				isTaxIncluded: typeof product.isTaxIncluded === "boolean" ? product.isTaxIncluded : true,
				taxRate: typeof product.taxRate === "number" ? product.taxRate : 10,
				stockQuantity: typeof product.stockQuantity === "number" ? product.stockQuantity : 1000,
				barcode: product.barcode ?? "",
				category: typeof product.category === "object" && product.category !== null && "_id" in product.category
					? product.category._id
					: (product.category ?? ""),
				brand: typeof product.brand === "object" && product.brand !== null && "_id" in product.brand
					? product.brand._id
					: (product.brand ?? ""),
				collections: Array.isArray(product.collections)
					? product.collections.map(c =>
						typeof c === "object" && c !== null && "_id" in c
							? c._id
							: c
					)
					: [],
				photoUrls: Array.isArray(product.photoUrls) ? product.photoUrls : [],
				documentUrl: product.documentUrl ?? "",
			})
		}
	}, [product])

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: formValues,
		validationSchema: productSchema,
		onSubmit: async values => {
			console.log('🚀 ~ ProductForm.tsx:103 ~ ProductForm ~ values:', values)
			setSubmitting(true)
			const _valuesToSubmit = {
				...values,
				keywords: values.keywords
					.split(",")
					.map(k => k.trim())
					.filter(Boolean)
			}
			console.log('🚀 ~ ProductForm.tsx:103 ~ ProductForm ~ editMode:', editMode)
			try {
				if (editMode) {
					await api(`/api/admin/products/${product._id}`, {
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
				router.push('/admin/products')
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

	const collectionOptions = collections.map(coll => ({
		value: coll._id,
		label: coll.name
	}));

	const selectedCollectionOptions = formik.values.collections.map(collId =>
		collectionOptions.find(option => option.value === collId)
	).filter(Boolean); // Filter out any undefined if an ID doesn't match an option

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
				<label htmlFor="collections">
					Koleksiyonlar
					<Select
						id="collections"
						name="collections"
						options={collectionOptions}
						value={selectedCollectionOptions}
						isMulti
						onChange={(newValue) => {
							const values = newValue ? newValue.map(item => item?.value) : []
							formik.setFieldValue('collections', values)
						}}
						onBlur={() => formik.setFieldTouched('collections', true)}
						classNamePrefix="react-select"
						className={formik.errors.collections && formik.touched.collections ? styles.errorSelect : styles.customSelect}
					/>
					{formik.touched.collections && formik.errors.collections && <div className={styles.err}>{formik.errors.collections as string}</div>}
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
				<div className={styles.imagePreviewGrid}>
					{formik.values.photoUrls.map(url =>
						<div key={url} className={styles.imagePreviewItem}>
							<Image
								src={url}
								alt="Ürün fotoğrafı"
								width={110}
								height={110}
							/>
							<button type="button" onClick={() => removePhoto(url)} className={styles.removeImageBtn}>✕</button>
						</div>
					)}
				</div>
				{formik.touched.photoUrls && typeof formik.errors.photoUrls === 'string' && <div className={styles.err}>{formik.errors.photoUrls}</div>}
			</div>
			<div className={styles.formActions}>
				<button type="button" className="btn btn-outline btn-large" onClick={() => router.push('/admin/products')}>Vazgeç</button>
				<button
					type="submit"
					className="btn btn-primary btn-large"
					disabled={submitting || !formik.isValid || formik.isSubmitting}
				>
					{editMode ? 'Güncelle' : 'Ekle'}
				</button>
			</div>
		</form>
	)
}