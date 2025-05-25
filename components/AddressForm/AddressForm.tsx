'use client'

import { useForm } from "react-hook-form"
import styles from "./AddressForm.module.scss"
import { AddressSelector } from "@/components/AddressSelector/AddressSelector"

export type AddressFormValues = {
	title: string
	recipient: string
	tc?: string
	phone: string
	email?: string
	address: string
	provinceId: string
	districtId: string
	neighbourhoodId: string
	postalCode?: string
	isBillingSame?: boolean
	// Billing
	invoiceName?: string
	taxNumber?: string
	taxOffice?: string
	invoiceAddress?: string
}

type Props = {
	defaultValues?: Partial<AddressFormValues>
	onSubmit: (data: AddressFormValues) => void
	onCancel: () => void
	loading?: boolean
}

export default function AddressForm({ defaultValues = {}, onSubmit, onCancel, loading }: Props) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors }
	} = useForm<AddressFormValues>({
		defaultValues: {
			isBillingSame: true,
			...defaultValues
		}
	})

	const provinceId = watch("provinceId") || ""
	const districtId = watch("districtId") || ""
	const neighbourhoodId = watch("neighbourhoodId") || ""
	const isBillingSame = watch("isBillingSame")

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.grid}>
				<div className={styles.formGroup}>
					<label>Adres Adı *</label>
					<input {...register("title", { required: "Adres adı gerekli" })} disabled={loading} />
					{errors.title && <span className={styles.err}>{errors.title.message}</span>}
				</div>
				<div className={styles.formGroup}>
					<label>Teslimat Alacak Kişi *</label>
					<input {...register("recipient", { required: "Alıcı adı gerekli" })} disabled={loading} />
					{errors.recipient && <span className={styles.err}>{errors.recipient.message}</span>}
				</div>
				<div className={styles.formGroup}>
					<label>TC</label>
					<input {...register("tc")} disabled={loading} />
				</div>
				<div className={styles.formGroup}>
					<label>Telefon *</label>
					<input {...register("phone", { required: "Telefon gerekli" })} disabled={loading} />
					{errors.phone && <span className={styles.err}>{errors.phone.message}</span>}
				</div>
				<div className={styles.formGroup}>
					<label>E-Posta *</label>
					<input {...register("email", { required: "E-posta gerekli" })} disabled={loading} />
					{errors.email && <span className={styles.err}>{errors.email.message}</span>}
				</div>
				<AddressSelector
					provinceId={provinceId}
					districtId={districtId}
					neighbourhoodId={neighbourhoodId}
					onChange={data => {
						Object.entries(data).forEach(([k, v]) => setValue(k as keyof AddressFormValues, v))
					}}
				/>
				<div className={styles.addressCol + " " + styles.formGroup}>
					<label>Adres *</label>
					<input {...register("address", { required: "Adres gerekli" })} disabled={loading} />
					{errors.address && <span className={styles.err}>{errors.address.message}</span>}
				</div>
				<div className={styles.formGroup}>
					<label>Posta Kodu *</label>
					<input {...register("postalCode", { required: "Posta kodu gerekli" })} disabled={loading} />
					{errors.postalCode && <span className={styles.err}>{errors.postalCode.message}</span>}
				</div>
			</div>
			<label className={styles.billingCheckbox}>
				<input
					type="checkbox"
					{...register("isBillingSame")}
					checked={isBillingSame}
					onChange={e => setValue("isBillingSame", e.target.checked)}
					disabled={loading}
				/>
				Fatura bilgilerim teslimat adresimle aynı
			</label>
			{!isBillingSame && (
				<>
					<h2>Fatura Bilgileri</h2>
					<div className={styles.billingGrid}>
						<div className={styles.formGroup}>
							<label>Fatura Ad Soyad</label>
							<input {...register("invoiceName")} disabled={loading} />
						</div>
						<div className={styles.formGroup}>
							<label>Vergi Numarası</label>
							<input {...register("taxNumber")} disabled={loading} />
						</div>
						<div className={styles.formGroup}>
							<label>Vergi Dairesi</label>
							<input {...register("taxOffice")} disabled={loading} />
						</div>
						<div className={styles.formGroup}>
							<label>Fatura Adresi</label>
							<input {...register("invoiceAddress")} disabled={loading} />
						</div>
					</div>
				</>
			)}
			<div className={styles.formActions}>
				<button type="submit" className={styles.submitButton} disabled={loading}>Kaydet</button>
				<button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>Vazgeç</button>
			</div>
		</form>
	)
}