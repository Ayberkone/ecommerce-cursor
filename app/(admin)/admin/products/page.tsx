'use client'

import { useEffect, useState } from "react"
import { Product } from "@/types/Product"
import { api } from "@/utils/api"
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
// import styles from "./ProductsPage.module.scss"
import ProductTable from "@/components/ProductTable/ProductTable"

export default function ProductsPage() {
	const router = useRouter()
	const [products, setProducts] = useState<Product[]>([])
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		api<{ products: Product[]; count: number }>("/api/admin/products", { showLoader: true })
			.then((data) => {
				setProducts(data?.products)
				setCount(data?.count)
			})
			.catch(() => toast.error('Ürünler alınamadı'))
			.finally(() => setLoading(false))
	}, [])

	const handleAdd = () => router.push('/admin/products/new')

	const handleEdit = (product: Product) => router.push('/admin/products/new' + product._id)

	const handleDelete = async (id: string) => {
		if (!confirm("Silmek istediğinize emin misiniz?")) return
		await api(`/api/admin/products/${id}`, { method: "DELETE" })
		setProducts(products => products.filter(p => p._id !== id))
	}

	return (
		<>
			{/* <div className={styles.page}> */}
			<h1>Ürünler</h1>
			<button className="btn btn-primary" onClick={handleAdd}>+ Yeni Ürün</button>
			{/* <button className={styles.addBtn} onClick={handleAdd}>+ Yeni Ürün</button> */}
			<ProductTable products={products} count={count} onEditAction={handleEdit} onDeleteAction={handleDelete} loading={loading} />
		</>
	)
}