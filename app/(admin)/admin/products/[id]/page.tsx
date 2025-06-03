// app/(admin)/admin/products/[id]/page.tsx

import ProductForm from "@/components/ProductForm/ProductForm"
import { fetchProduct } from "@/utils/admin/adminApi"

export default async function ProductAddEditPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const product = await fetchProduct(id)
	return <ProductForm product={product} />
}