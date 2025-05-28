'use client'

import { Product } from "@/types/Product"
import { Column, Table } from "@/components/Table/Table"

type Props = {
	products: Product[]
	count: number
	onEditAction: (product: Product) => void
	onDeleteAction: (id: string) => void
	loading: boolean
}

export default function ProductTable({ products, count, onEditAction, onDeleteAction, loading }: Props) {
	if (loading) return <div>Yükleniyor...</div>
	if (!products.length) return <div>Hiç ürün yok.</div>

	const columns: Column<Product>[] = [
		{ header: "Ad", accessor: (p: Product) => p.name },
		{ header: "Kategori", accessor: (p: Product) => p.category || "-" },
		{ header: "Fiyat", accessor: (p: Product) => p.price?.regular ? `${p.price.regular}₺` : "-" },
		{ header: "Stok", accessor: (p: Product) => p.stockQuantity },
		{
			header: "",
			accessor: (p: Product) => p._id,
			className: "actions",
			cell: (_id: string, p: Product) => (
				<>
					<button className="btn btn-small btn-outline" onClick={() => onEditAction(p)}>Düzenle</button>
					<button className="btn btn-small btn-danger" onClick={() => onDeleteAction(_id)}>Sil</button>
				</>
			)
		}
	]

	return (
		<Table<Product>
			columns={columns}
			data={products}
			rowKey={(p) => p._id ?? ""}
		/>
	)
}