// app/my-account/orders/page.tsx
'use client'

import { Table } from "@/components/Table/Table"
import { myAccountOrdersColumns } from "./MyAccountOrdersColumns"
import { useState, useCallback } from "react"

export default function MyAccountOrdersPage() {
	const [refresh, setRefresh] = useState(false)

	// Table'dan gelen action'ları yakala (örn: iade sonrası refresh)
	function handleAction(action: string, row: any) {
		if (action === "refresh") {
			setRefresh(r => !r)
		}
	}

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
				refresh={refresh}
				onAction={handleAction}
			/>
		</div>
	)
}