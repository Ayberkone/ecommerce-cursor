// app/(admin)/admin/products/[id]/page.tsx

import ProductForm from "@/components/ProductForm/ProductForm"

interface ProductAddEditPageProps {
	params: { id: string }
}

export default function ProductAddEditPage({ params }: ProductAddEditPageProps) {
	// You can fetch summary data here using server components/queries
	return (
		<ProductForm params={{ id: params.id }} />
	)
}
