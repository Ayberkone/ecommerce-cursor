// app/(admin)/admin/products/[id]/page.tsx

import ProductForm from "@/components/ProductForm/ProductForm"


type pParams = Promise<{ id: string }>

export default async function ProductAddEditPage(props: { params: pParams }) {
	const { id } = await props.params

	return (
		<ProductForm params={{ id }} />
	)
}
