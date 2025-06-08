'use client'
import CRUDCard, { FieldDef } from "@/components/Admin/CRUDCard/CRUDCard"
import styles from "./CategoriesBrandsPage.module.scss"

export default function CategoriesBrandsPage() {
	// Define the fields you want for each entity:
	const categoryFields: FieldDef[] = [
		{ key: "name", label: "Ad", required: true, maxLength: 50 },
		{ key: "description", label: "Açıklama", type: 'Editor' },
		{ key: "proDescription", label: "Pro Açıklama", type: 'Editor' },
		{ key: "order", label: "Sıra", type: "number" },
		{ key: "imageUrl", label: "Görsel", type: "image" }
	]
	const brandFields: FieldDef[] = [
		{ key: "name", label: "Ad", required: true, maxLength: 50 },
		{ key: "description", label: "Açıklama", type: 'Editor' },
		{ key: "proDescription", label: "Pro Açıklama", type: 'Editor' },
		{ key: "order", label: "Sıra", type: "number" },
		{ key: "imageUrl", label: "Görsel", type: "image" }
	]
	const collectionFields: FieldDef[] = [
		{ key: "name", label: "Ad", required: true, maxLength: 50 },
		{ key: "description", label: "Açıklama", type: 'Editor' },
		{ key: "proDescription", label: "Pro Açıklama", type: 'Editor' },
		{ key: "order", label: "Sıra", type: "number" },
		{ key: "imageUrl", label: "Görsel", type: "image" }
	]
	return (
		<div className={styles.root}>
			<h1>Kategori, Marka & Koleksiyon Yönetimi</h1>
			<div className={styles.cards}>
				<CRUDCard title="Kategoriler" endpoint="/api/categories" adminEndpoint="/api/admin/categories" fields={categoryFields} />
				<CRUDCard title="Markalar" endpoint="/api/brands" adminEndpoint="/api/admin/brands" fields={brandFields} />
				<CRUDCard title="Koleksiyonlar" endpoint="/api/collections" adminEndpoint="/api/admin/collections" fields={collectionFields} />
			</div>
		</div>
	)
}