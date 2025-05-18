'use client'

import styles from '@/app/orders/OrdersPage.module.scss'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext/AuthContext'
import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const key = `orders_${user.username}`
    setOrders(JSON.parse(localStorage.getItem(key) || '[]'))
  }, [user])

  if (!user) {
    return <div>Lütfen giriş yapın.</div>
  }

  return (
    <div>
      <h1 className={styles.title}>Siparişlerim</h1>
      <div className={styles.ordersTableWrap}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Kod</th>
              <th>Tutar</th>
              <th>Adres</th>
              <th>Ürün Sayısı</th>
              <th>Durum</th>
              <th>Görünüm</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  <span className={styles.orderCode}>{order.id}</span>
                </td>
                <td>{order.total}₺</td>
                <td>{order.address}</td>
                <td>{order.items?.length || 0}</td>
                <td>
                  <span className={styles.waiting}>Onay Bekliyor</span>
                </td>
                <td>
                  {/* THIS IS THE "Detay" LINK */}
                  <Link
                    href={`/my-account/orders/${order.id}`}
                    className={styles.detailBtn}
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
