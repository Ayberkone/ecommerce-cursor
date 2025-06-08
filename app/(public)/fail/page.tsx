export default function PaymentFailPage() {
	return (
		<main style={{ padding: 40, textAlign: "center" }}>
			<h1>Ödeme Başarısız</h1>
			<p>Ödemeniz sırasında bir hata oluştu.<br /> Lütfen tekrar deneyin veya bizimle iletişime geçin.</p>
			<a href="/checkout" className="btn btn-primary">Tekrar Dene</a>
		</main>
	)
}