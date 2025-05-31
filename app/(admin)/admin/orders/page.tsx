// app/admin/orders/page.tsx

import AdminOrdersTable from "@/components/Admin/OrdersTable/OrdersTable"

export default function AdminOrders() {
	return (
		<>
			<h1>Siparişler</h1>
			<AdminOrdersTable />
		</>
	)
}