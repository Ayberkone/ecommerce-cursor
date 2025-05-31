'use client'
import { useRouter } from "next/navigation"
import { Formik, Form, Field } from "formik"
import { api } from "@/utils/api"
import { toast } from "sonner"

export default function DeleteAccountSection() {
	const router = useRouter()

	return (
		<Formik
			initialValues={{ password: "", confirm: false }}
			validate={values => {
				const errors: any = {}
				if (!values.password) errors.password = "Şifre gerekli"
				if (!values.confirm) errors.confirm = "Onay gerekli"
				return errors
			}}
			onSubmit={async (values, { setSubmitting }) => {
				try {
					await api("/api/auth/me", {
						method: "DELETE",
						body: JSON.stringify({ password: values.password }),
						showLoader: true
					})
					toast.success("Hesabınız silindi.")
					router.push("/logout")
				} catch (err: any) {
					toast.error(err?.message || "Silinemedi.")
				} finally {
					setSubmitting(false)
				}
			}}
		>
			{({ isSubmitting, errors, touched }) => (
				<Form style={{ maxWidth: 400, margin: "2rem auto" }}>
					<h2>Hesabımı Sil</h2>
					<p>Dikkat: Bu işlem geri alınamaz. Sipariş geçmişiniz ve verileriniz silinir.</p>
					<div>
						<label>
							Şifreniz:
							<Field
								type="password"
								name="password"
								autoComplete="current-password"
								style={{ width: "100%", marginBottom: 8 }}
							/>
							{errors.password && touched.password && (
								<div style={{ color: "red", fontSize: 12 }}>{errors.password}</div>
							)}
						</label>
					</div>
					<div style={{ margin: "8px 0" }}>
						<label style={{ display: "flex", alignItems: "center" }}>
							<Field type="checkbox" name="confirm" />
							Hesabımı silmek istediğimi onaylıyorum.
							{errors.confirm && touched.confirm && (
								<div style={{ color: "red", fontSize: 12 }}>{errors.confirm}</div>
							)}
						</label>
					</div>
					<button type="submit" className="btn btn-danger" disabled={isSubmitting}>
						{isSubmitting ? "Siliniyor..." : "Hesabımı Sil"}
					</button>
				</Form>
			)}
		</Formik>
	)
}