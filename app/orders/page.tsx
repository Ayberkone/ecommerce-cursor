'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthContext/AuthContext'
import styles from './OrdersPage.module.scss'
import Link from 'next/link'

type Order = {
  id: number
  items: any[]
  total: number
  date: string
}

const OrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    const key = `orders_${user.username}`
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    setOrders(saved)
  }, [user])

  if (!user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>My Orders</h1>
        <div className={styles.notLoggedIn}>
          Please <Link href="/login" className={styles.link}>login</Link> to view your orders.
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Orders</h1>
      {orders.length === 0 ? (
        <div className={styles.empty}>No orders yet.</div>
      ) : (
        <div className={styles.list}>
          {orders.map(order => (
            <div className={styles.order} key={order.id}>
              <div className={styles.orderTop}>
                <span className={styles.orderDate}>{new Date(order.date).toLocaleString()}</span>
                <span className={styles.orderTotal}>Total: ₺{order.total.toFixed(2)}</span>
              </div>
              <ul className={styles.items}>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name || '-'} ×{item.quantity || 1} — ₺{item.price?.toFixed(2) || '-'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default OrdersPage
