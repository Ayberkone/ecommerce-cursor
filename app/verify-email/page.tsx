// app/verify-email/page.tsx
import { Suspense } from "react"
import VerifyEmailPage from "./VerifyEmailPage"

export const dynamic = "force-dynamic"

export default function Page() {
	return (
		<Suspense fallback={<div>Yükleniyor...</div>}>
			<VerifyEmailPage />
		</Suspense>
	)
}