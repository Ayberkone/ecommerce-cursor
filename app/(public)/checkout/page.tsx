'use client'

import { useCart } from '@/components/CartContext'
import Link from 'next/link'
import styles from './CheckoutPage.module.scss'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from "@/context/AuthContext/AuthContext"
import { getAddresses, addAddress, Address } from "@/utils/addressApi"
import AddressForm, { AddressFormValues } from "@/components/AddressForm/AddressForm"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { createOrder } from "@/utils/ordersApi"
import { initPaytr } from "@/utils/payTRApi"

export default function CheckoutPage() {
  const { cart: { items }, clearCart } = useCart()
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [iframeToken, setIframeToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"form" | "pay" | "done">("form")
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)

  // Adresleri çek
  useEffect(() => {
    if (user) {
      getAddresses()
        .then(list => {
          setAddresses(list)
          if (list.length) setSelectedAddressId((list.find(a => a.isDefault)?._id || list[0]?._id) || "")
        })
        .catch(() => setAddresses([]))
    }
  }, [user])

  // Ödeme başlatan fonksiyon
  async function handlePayment(info: {
    recipient: string
    phone: string
    address: string
    email: string
  }) {
    setLoading(true)
    try {
      // 1. Siparişi BE'ye kaydet
      const order = await createOrder({
        items,
        total,
        address: info.address,
        phone: info.phone,
        email: info.email,
        paymentMethod: "credit_card"
      })

      // 2. PayTR token'ı al
      const basket = items.map(i => [i.name, (i.price || 0).toFixed(2), i.quantity])
      let userRealIp = "127.0.0.1" // Default fallback IP
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        if (ipResponse.ok) {
          const ipData = await ipResponse.json()
          userRealIp = ipData.ip
        } else {
          console.warn(`Failed to fetch user IP: ${ipResponse.status}. Using fallback IP.`)
        }
      } catch (error) {
        console.error('Error fetching user IP:', error, 'Using fallback IP.')
      }

      const paytr = await initPaytr({
        basket,
        email: info.email,
        payment_amount: Math.round(total * 100),
        user_name: info.recipient,
        user_address: info.address,
        user_phone: info.phone,
        user_ip: userRealIp, // Use the fetched or fallback IP
        merchant_oid: order.merchant_oid
      })

      setIframeToken(paytr.token)
      setStep("pay")
    } catch (err: any) {
      console.log('🚀 ~ page.tsx:74 ~ CheckoutPage ~ err:', err)
      toast.error(err.message || "Bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  // --- ADIM 1 ---
  if (step === "form") {
    return (
      <main className={styles.main}>
        <h1 className={styles.sectionTitle}>Ödeme</h1>
        {items.length === 0 ? (
          <div>
            Sepetiniz boş. <Link href="/products" className={styles.link}>Ürünlere Dön</Link>
          </div>
        ) : (
          <>
            <ul className={styles.cartList}>
              {items.map(item => (
                <li key={item.id} className={styles.cartItem}>
                  <span className={styles.cartItemName}>{item.name || '-'}</span>
                  <span className={styles.cartItemQty}>x{item.quantity || 1}</span>
                  <span className={styles.cartItemPrice}>₺{item.price?.toFixed(2) || '-'}</span>
                </li>
              ))}
            </ul>
            <div className={styles.checkoutTotal}>
              <strong>Toplam:</strong> ₺{total.toFixed(2)}
            </div>

            {/* Giriş yapmış kullanıcıya adres seçtir */}
            {user ? (
              <>
                <h2>Adres Seçimi</h2>
                {addresses.length > 0 && !showAddressForm ? (
                  <div>
                    <select
                      value={selectedAddressId}
                      onChange={e => setSelectedAddressId(e.target.value)}
                      className={styles.addressSelect}
                    >
                      {addresses.map(addr => (
                        <option key={addr._id} value={addr._id}>
                          {addr.title} - {addr.recipient} ({addr.address})
                        </option>
                      ))}
                    </select>
                    <button type="button" className={styles.addAddressBtn} onClick={() => setShowAddressForm(true)}>
                      Yeni Adres Ekle
                    </button>
                  </div>
                ) : (
                  showAddressForm && (
                    <div className={styles.addressForm}>
                      <AddressForm
                        defaultValues={{
                          recipient: user ? `${user.firstName} ${user.lastName}`.trim() : "",
                          phone: user?.phone || "",
                        }}
                        onSubmitAction={async (data: AddressFormValues) => {
                          setLoading(true)
                          try {
                            const addr = await addAddress(data)
                            setAddresses(a => [...a, addr])
                            setSelectedAddressId(addr._id!)
                            setShowAddressForm(false)
                            toast.success("Adres kaydedildi.")
                          } catch {
                            toast.error("Adres eklenemedi!")
                          } finally {
                            setLoading(false)
                          }
                        }}
                        onCancelAction={() => setShowAddressForm(false)}
                        loading={loading}
                      />
                    </div>
                  )
                )}
                {/* Adres seçildiyse ödemeye geç */}
                {addresses.length > 0 && !showAddressForm && (
                  <button
                    className={styles.place}
                    type="button"
                    disabled={loading || !selectedAddressId}
                    onClick={() => {
                      const addr = addresses.find(a => a._id === selectedAddressId)!
                      handlePayment({
                        recipient: addr.recipient,
                        phone: addr.phone,
                        address: addr.address,
                        email: user.email
                      })
                    }}
                  >
                    {loading ? "Yükleniyor..." : "Ödemeye Geç"}
                  </button>
                )}
              </>
            ) : (
              // Misafir kullanıcı için Formik ile validasyonlu form
              <Formik
                initialValues={{
                  recipient: "",
                  phone: "",
                  address: "",
                  email: "",
                }}
                validationSchema={Yup.object({
                  recipient: Yup.string().required("Zorunlu"),
                  phone: Yup.string().required("Zorunlu"),
                  address: Yup.string().required("Zorunlu"),
                  email: Yup.string().email("Geçersiz e-posta").required("Zorunlu"),
                })}
                onSubmit={handlePayment}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="mb-16 d-grid gap-16">
                    <h2>Adres Bilgileri</h2>
                    <label>
                      Alıcı Adı
                      <Field name="recipient" />
                      <ErrorMessage name="recipient" component="div" className="error" />
                    </label>
                    <label>
                      Telefon
                      <Field type="tel" name="phone" />
                      <ErrorMessage name="phone" component="div" className="error" />
                    </label>
                    <label>
                      Adres
                      <Field as="textarea" name="address" />
                      <ErrorMessage name="address" component="div" className="error" />
                    </label>
                    <label>
                      E-posta
                      <Field type="email" name="email" />
                      <ErrorMessage name="email" component="div" className="error" />
                    </label>
                    <button
                      className={styles.place}
                      type="submit"
                      disabled={loading || !isValid || !dirty || isSubmitting}
                    >
                      {loading || isSubmitting ? "Yükleniyor..." : "Ödemeye Geç"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </>
        )}
      </main>
    )
  }

  // --- ADIM 2: PayTR iframe ile ödeme ---
  if (step === "pay" && iframeToken) {
    return (
      <main className={styles.main}>
        <h1 className={styles.sectionTitle}>Güvenli Ödeme</h1>
        <div style={{ maxWidth: 500, margin: "auto" }}>
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{ width: "100%", minHeight: 1100, border: "none" }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/products" className={styles.link}>Alışverişe Devam Et</Link>
        </div>
      </main>
    )
  }

  // --- ADIM 3: Ödeme tamamlandı ---
  if (step === "done") {
    clearCart()
    return (
      <main className={styles.main}>
        <h1>Siparişiniz Alındı</h1>
        <p>Teşekkürler! Siparişiniz başarıyla oluşturuldu ve ödemeniz alındı.</p>
        <Link href="/products" className={styles.link}>Ürünlere Dön</Link>
      </main>
    )
  }

  return null
}