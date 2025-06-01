'use client'

import { useRouter } from 'next/navigation'
import { Table, Column } from "@/components/Table/Table"
import { Product } from "@/types/Product"
import { deleteProduct } from "@/utils/admin/adminApi"
import { toast } from 'sonner'

export default function ProductsPage() {
	const router = useRouter()

	// Table column definitions
	const columns: Column<Product>[] = [
		{ header: "Ad", accessor: (p: Product) => p.name, sortKey: "name" },
		{ header: "Kategori", accessor: (p: Product) => p.category?.name || "-", sortKey: "category" },
		{ header: "Fiyat", accessor: (p: Product) => p.price?.regular ? `${p.price.regular}₺` : "-", sortKey: "price.regular" },
		{ header: "Stok", accessor: (p: Product) => p.stockQuantity, sortKey: "stockQuantity" },
		{
			header: "İşlemler",
			accessor: (p: Product) => p._id,
			cell: (_id: string, p: Product, triggerAction) => (
				<>
					<button className="btn btn-small btn-outline" onClick={() => triggerAction("edit", p)}>Düzenle</button>
					<button className="btn btn-small btn-danger" onClick={() => triggerAction("delete", p)}>Sil</button>
				</>
			),
			className: "actions"
		}
	]

	// Handle edit and delete actions
	const handleAction = async (action: string, product: Product) => {
		if (action === "edit") {
			router.push(`/admin/products/${product._id}`)
		}
		if (action === "delete") {
			if (!confirm("Silmek istediğinize emin misiniz?")) return
			try {
				await deleteProduct(product._id)
				toast.success("Ürün silindi.")
				// Optionally: trigger Table refresh using a state variable
			} catch (e: any) {
				toast.error("Ürün silinemedi: " + (e?.message || ""))
			}
		}
	}

	return (
		<div>
			<h1>Ürünler</h1>
			<button className="btn btn-primary" onClick={() => router.push('/admin/products/new')}>+ Yeni Ürün</button>
			<Table<Product>
				endpoint="/api/admin/products"
				columns={columns}
				rowKey={p => p._id}
				noDataMessage="Hiç ürün yok."
				initialSortField="createdAt"
				initialSortOrder="desc"
				searchPlaceholder="Ürün adı ile ara"
				onAction={handleAction}
			/>
		</div>
	)
}