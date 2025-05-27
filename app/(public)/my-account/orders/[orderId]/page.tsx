// app/my-account/orders/[orderId]/page.tsx
'use client'

import { useEffect, useState } from "react"
import styles from "./OrderDetailPage.module.scss"
import { api } from "@/utils/api"
import { useParams, useRouter } from "next/navigation"
import { orderStatusLabels, paymentStatusLabels, paymentMethods, cargoCompanies } from "@/components/OrdersTable/ordersTableConfig"

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api(`/api/orders/${orderId}`)
      .then(setOrder)
      .catch(() => router.push("/my-account/orders"))
      .finally(() => setLoading(false))
  }, [orderId, router])

  if (loading) return <div>Yükleniyor...</div>
  if (!order) return <div>Sipariş bulunamadı.</div>

  return (
    <div className={styles.detailWrap}>
      <h1 className={styles.titleDetail}>Sipariş Detayı</h1>
      <div className={styles.grid}>
        <div>
          <label>Kod</label>
          <input type="text" className="form-control" value={order._id} disabled />
        </div>
        <div>
          <label>Üye Mail</label>
          <input type="text" className="form-control" value={order.email} disabled />
        </div>
        <div>
          <label>Ürün Toplam</label>
          <input type="text" className="form-control" value={order.subtotal ?? "-"} disabled />
        </div>
        <div>
          <label>Kargo Toplam</label>
          <input type="text" className="form-control" value={order.shippingTotal ?? "-"} disabled />
        </div>
        <div>
          <label>Vergi Toplam</label>
          <input type="text" className="form-control" value={order.taxTotal ?? "-"} disabled />
        </div>
        <div>
          <label>İndirim Toplam</label>
          <input type="text" className="form-control" value={order.discountTotal ?? "-"} disabled />
        </div>
        <div>
          <label>Ek Ücret</label>
          <input type="text" className="form-control" value={order.extraTotal ?? "-"} disabled />
        </div>
        <div>
          <label>Toplam Ödeme</label>
          <input type="text" className="form-control" value={order.total} disabled />
        </div>
        <div>
          <label>Adres Adı</label>
          <input type="text" className="form-control" value={order.addressLabel ?? "-"} disabled />
        </div>
        <div>
          <label>Alıcı Kişi</label>
          <input type="text" className="form-control" value={order.recipientName ?? "-"} disabled />
        </div>
        <div>
          <label>Telefon</label>
          <input type="text" className="form-control" value={order.phone ?? "-"} disabled />
        </div>
        <div>
          <label>Mail</label>
          <input type="text" className="form-control" value={order.email ?? "-"} disabled />
        </div>
        <div className={styles.addressCol}>
          <label>Açık Adres</label>
          <input type="text" className="form-control" value={order.address ?? "-"} disabled />
        </div>
      </div>

      {/* Status */}
      <div className={styles.statusRow}>
        <div>
          <label>Ödeme Durum</label>
          <span>{paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}</span>
        </div>
        <div>
          <label>Ödeme Tür</label>
          <span>{paymentMethods[order.paymentMethod as keyof typeof paymentMethods]}</span>
        </div>
        <div>
          <label>Sipariş Durum</label>
          <span>{orderStatusLabels[order.status as keyof typeof orderStatusLabels]}</span>
        </div>
        <div>
          <label>Kargo Firma</label>
          <span>{cargoCompanies[order.cargoCompany as keyof typeof cargoCompanies] || "-"}</span>
        </div>
        <div>
          <label>Kargo No</label>
          <span>{order.cargoNo || "-"}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.productsWrap}>
        <table>
          <thead>
            <tr>
              <th>Kod</th>
              <th>Ürün</th>
              <th>Varyasyon</th>
              <th>Adet</th>
              <th>Fiyat</th>
              <th>Kargo</th>
              <th>KDV</th>
              <th>Kupon</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any, i: number) => (
              <tr key={item._id || i}>
                <td>{item.code || order._id}</td>
                <td>{item.name}</td>
                <td>{item.variant || ""}</td>
                <td>{item.quantity}</td>
                <td>{item.price}₺</td>
                <td>{item.shippingFee ?? "-"}</td>
                <td>{item.tax ?? "-"}</td>
                <td>{item.coupon ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}