'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthContext/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import styles from './OrderDetailPage.module.scss'
import Link from 'next/link'

export default function OrderDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id

  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const key = `orders_${user.username}`
    const allOrders = JSON.parse(localStorage.getItem(key) || '[]')
    setOrder(allOrders.find((o: any) => String(o.id) === String(orderId)))
  }, [orderId, user])

  if (!user) {
    router.push('/login')
    return null
  }

  if (!order) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Sipariş Detayı</h1>
        <div className={styles.notFound}>Sipariş bulunamadı.</div>
        <Link href="/my-account/orders" className={styles.backBtn}>← Siparişlerim</Link>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Sipariş Detayı</h1>
      <div className={styles.summary}>
        <div><strong>Kod:</strong> <span className={styles.orderCode}>{order.id}</span></div>
        <div><strong>Durum:</strong> <span className={styles.statusWaiting}>Onay Bekliyor</span></div>
        <div><strong>Tutar:</strong> ₺{order.total?.toFixed(2) || '-'}</div>
        <div><strong>Tarih:</strong> {order.date ? new Date(order.date).toLocaleString() : '-'}</div>
        <div><strong>Adres:</strong> {order.address || '-'}</div>
        <div><strong>Ürün Sayısı:</strong> {order.items?.length || 0}</div>
      </div>
      <h2 className={styles.subtitle}>Ürünler</h2>
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Adet</th>
            <th>Birim Fiyat</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item: any, i: number) => (
            <tr key={i}>
              <td>{item.name || '-'}</td>
              <td>{item.quantity || 1}</td>
              <td>₺{item.price?.toFixed(2) || '-'}</td>
              <td>₺{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/my-account/orders" className={styles.backBtn}>← Siparişlerim</Link>
    </main>
  )
}
