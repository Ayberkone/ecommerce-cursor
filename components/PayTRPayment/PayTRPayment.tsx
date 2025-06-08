import React, { useState } from "react"

export default function PayTRPayment({
	basket,
	email,
	user_name,
	user_address,
	user_phone,
	total,
	onPaymentStarted
}: {
	basket: [string, string, number][] // [['Product Name', '12.00', 2], ...]
	email: string
	user_name: string
	user_address: string
	user_phone: string
	total: number // e.g., 189.90, but BE expects 18990 (TL * 100)
	onPaymentStarted?: () => void // Optional callback
}) {
	const [paytrToken, setPaytrToken] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Optionally: generate a random merchant_oid here (should be unique per order)
	const merchant_oid = "ORD" + Date.now()

	const handlePay = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch("/api/paytr/init", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					basket,
					email,
					payment_amount: Math.round(total * 100), // as PayTR expects
					user_name,
					user_address,
					user_phone,
					user_ip: "", // leave blank, BE can fill if needed
					merchant_oid,
				})
			})
			const data = await res.json()
			if (res.ok && data.token) {
				setPaytrToken(data.token)
				onPaymentStarted?.()
			} else {
				setError(data.error || "Ödeme başlatılamadı")
			}
		} catch (err: any) {
			setError(err.message || "Network error")
		} finally {
			setLoading(false)
		}
	}

	if (paytrToken) {
		// Show the iframe
		return (
			<iframe
				src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
				id="paytriframe"
				frameBorder="0"
				scrolling="no"
				style={{ width: "100%", height: 600, border: "none" }}
				title="Ödeme"
			/>
		)
	}

	return (
		<div>
			<button className="btn btn-success" disabled={loading} onClick={handlePay}>
				{loading ? "Yönlendiriliyor..." : "PayTR ile Öde"}
			</button>
			{error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
		</div>
	)
}