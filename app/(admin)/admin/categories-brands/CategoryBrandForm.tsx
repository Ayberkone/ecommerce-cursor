'use client'
import { useFormik } from "formik"

type FormValues = {
	name: string
	description: string
	order: number
	imageUrl: string
}

type Props = {
	type: 'category' | 'brand' | 'collection'
	initialValues?: { _id?: string, name?: string, description?: string, order?: number, imageUrl?: string }
	onSubmitAction: (values: FormValues, id?: string) => void
	onCancelAction: () => void
}

export default function CategoryBrandForm({ type, initialValues, onSubmitAction, onCancelAction }: Props) {
	const formik = useFormik<FormValues>({
		initialValues: {
			name: initialValues?.name || "",
			description: initialValues?.description || "",
			order: initialValues?.order ?? 0,
			imageUrl: initialValues?.imageUrl || ""
		},
		enableReinitialize: true,
		validate: values => {
			const errors: Partial<Record<keyof FormValues, string>> = {}
			if (!values.name || values.name.length < 2) errors.name = "En az 2 karakter"
			if (values.order && isNaN(Number(values.order))) errors.order = "Sıra bir sayı olmalı"
			return errors
		},
		onSubmit: values => onSubmitAction(values, initialValues?._id)
	})

	return (
		<form onSubmit={formik.handleSubmit} style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
			<input
				name="name"
				placeholder={type === "category" ? "Kategori Adı" : type === "brand" ? "Marka Adı" : "Koleksiyon Adı"}
				value={formik.values.name}
				onChange={formik.handleChange}
				style={{ marginBottom: 4 }}
			/>
			{formik.errors.name && <div style={{ color: "red", fontSize: 12 }}>{formik.errors.name}</div>}
			<input
				name="description"
				placeholder="Açıklama"
				value={formik.values.description}
				onChange={formik.handleChange}
				style={{ marginBottom: 4 }}
			/>
			<input
				name="order"
				placeholder="Sıra (örn: 0, 1, 2...)"
				type="number"
				value={formik.values.order}
				onChange={formik.handleChange}
				style={{ marginBottom: 4 }}
			/>
			<input
				name="imageUrl"
				placeholder="Resim URL"
				value={formik.values.imageUrl}
				onChange={formik.handleChange}
				style={{ marginBottom: 4 }}
			/>
			<div style={{ display: "flex", gap: 8 }}>
				<button type="submit">{initialValues ? "Kaydet" : "Ekle"}</button>
				{initialValues && <button type="button" onClick={onCancelAction}>İptal</button>}
			</div>
		</form>
	)
}