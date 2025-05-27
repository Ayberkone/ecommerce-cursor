'use client'
import { useFormik } from "formik"

type Props = {
	type: 'category' | 'brand'
	initialValues?: { name?: string, _id?: string }
	onSubmitAction: (values: { name: string }, id?: string) => void
	onCancelAction: () => void
}

export default function CategoryBrandForm({ type, initialValues, onSubmitAction, onCancelAction }: Props) {
	const formik = useFormik({
		initialValues: {
			name: initialValues?.name || ""
		},
		enableReinitialize: true,
		validate: values => {
			const errors: any = {}
			if (!values.name || values.name.length < 2) errors.name = "En az 2 karakter"
			return errors
		},
		onSubmit: values => onSubmitAction(values, initialValues?._id)
	})

	return (
		<form onSubmit={formik.handleSubmit} style={{ marginTop: 8 }}>
			<input
				name="name"
				placeholder={type === "category" ? "Kategori Adı" : "Marka Adı"}
				value={formik.values.name}
				onChange={formik.handleChange}
			/>
			{formik.errors.name && <div style={{ color: "red", fontSize: 12 }}>{formik.errors.name}</div>}
			<button type="submit">{initialValues ? "Kaydet" : "Ekle"}</button>
			{initialValues && <button type="button" onClick={onCancelAction}>İptal</button>}
		</form>
	)
}