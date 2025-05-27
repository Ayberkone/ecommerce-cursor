// utils/productValidation.ts
import * as Yup from "yup"

export const productSchema = Yup.object().shape({
  name: Yup.string().required("Ürün adı gerekli"),
  seoTitle: Yup.string().required("SEO başlığı gerekli"),
  description: Yup.object().shape({
    normal: Yup.string().required("Açıklama gerekli"),
    mini: Yup.string().required("Kısa açıklama gerekli")
  }),
  proDescription: Yup.object().shape({
    normal: Yup.string().required("Pro açıklama gerekli"),
    mini: Yup.string().required("Pro kısa açıklama gerekli")
  }),
  keywords: Yup.string().required("Anahtar kelimeler gerekli"),
  videoLink: Yup.string().url("Geçerli bir video linki girin").nullable(),
  price: Yup.object().shape({
    regular: Yup.number().min(0).required("Fiyat gerekli"),
    pro: Yup.number().min(0).required("Pro fiyat gerekli"),
    storage: Yup.number().min(0).required("Depo fiyat gerekli")
  }),
  isTaxIncluded: Yup.boolean(),
  taxRate: Yup.number().min(0).max(100).required("Vergi oranı gerekli"),
  stockQuantity: Yup.number().min(0).required("Stok adedi gerekli"),
  barcode: Yup.string().required("Barkod gerekli"),
  category: Yup.string().required("Kategori gerekli"),
  brand: Yup.string().required("Marka gerekli"),
  photoUrls: Yup.array().of(Yup.string().url()).min(1, "En az 1 fotoğraf gerekli"),
  documentUrl: Yup.string().url("Geçerli bir belge linki girin").nullable()
})
