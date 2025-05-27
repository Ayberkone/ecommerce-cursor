// app/admin/product/[id]/page.tsx

import ProductForm from "@/components/ProductForm/ProductForm"


export default function ProductAddEditPage() {
	// You can fetch summary data here using server components/queries
	return (
		<ProductForm />
	)
}