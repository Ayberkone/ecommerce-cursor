// app/admin/page.tsx

export default function AdminDashboard() {
	// You can fetch summary data here using server components/queries
	return (
		<div style={{ display: "flex" }}>
			<h1>Admin Dashboard</h1>
			<div style={{ marginTop: 24 }}>
				<div>📦 Toplam Sipariş: [get count]</div>
				<div>👤 Toplam Kullanıcı: [get count]</div>
				<div>💰 Toplam Gelir: [get amount]</div>
			</div>
		</div>
	)
}