'use client'

import { Product } from "@/types/Product"
import styles from "./ProductTable.module.scss"

type Props = {
	products: Product[]
	count: number
	onEditAction: (product: Product) => void
	onDeleteAction: (id: string) => void
	loading: boolean
}

export default function ProductTable({ products, count, onEditAction, onDeleteAction, loading }: Props) {
	console.log('🚀 ~ ProductTable.tsx:44 ~ ProductTable ~ products:', products)
	if (loading) return <div>Yükleniyor...</div>
	if (!products.length) return <div>Hiç ürün yok.</div>
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Ad</th>
					<th>Kategori</th>
					<th>Fiyat</th>
					<th>Stok</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{products.map(p => (
					<tr key={p._id}>
						<td>{p.name}</td>
						<td>{p.category || "-"}</td>
						<td>{p.price?.regular}₺</td>
						<td>{p.stockQuantity}</td>
						<td>
							<button onClick={() => onEditAction(p)}>Düzenle</button>
							<button onClick={() => onDeleteAction(p._id!)}>Sil</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
