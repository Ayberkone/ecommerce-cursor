// app/admin/orders/page.tsx
import OrdersTable from '@/components/OrdersTable/OrdersTable'
import AdminSidebar from "@/components/Admin/AdminSidebar/AdminSidebar"

export default function AdminOrders() {
	return (
		<>
			<h1>Siparişler</h1>
			<OrdersTable admin />
		</>
	)
}