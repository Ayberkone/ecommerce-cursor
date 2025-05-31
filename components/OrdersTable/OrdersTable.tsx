// app/my-account/orders/page.tsx or similar
'use client'

import { Table } from "@/components/Table/Table"
import { myAccountOrdersColumns } from "./MyAccountOrdersColumns"

export default function MyAccountOrdersPage() {
	return (
		<div>
			<h1>Siparişlerim</h1>
			<Table
				endpoint="/api/orders"
				columns={myAccountOrdersColumns}
				rowKey={order => order._id}
				initialSortField="createdAt"
				initialSortOrder="desc"
				noDataMessage="Siparişiniz yok."
				searchPlaceholder="Sipariş kodu veya tarih ile ara"
				pageSizeOptions={[10, 20, 50]}
			/>
		</div>
	)
}