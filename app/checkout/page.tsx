'use client'

import { useCart } from '@/components/CartContext'
import Link from 'next/link'
import styles from './CheckoutPage.module.scss'
import { useState } from 'react'
import Toast from '@/components/Toast/Toast'
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthContext/AuthContext"

const CheckoutPage = () => {
  const { items, clearCart } = useCart()
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  const router = useRouter()
  const { user } = useAuth()
  const [toast, setToast] = useState('')

  const handlePlaceOrder = () => {
    setToast('Order placed!')
    clearCart()
    const order = {
      items,
      total,
      date: new Date().toISOString(),
      id: Date.now(),
    }
    if (user) {
      // Save under their username
      const key = `orders_${user.username}`
      const orders = JSON.parse(localStorage.getItem(key) || '[]')
      localStorage.setItem(key, JSON.stringify([order, ...orders]))
    }
    router.push('/success')
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Checkout</h1>
      {items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/products" className={styles.link}>Go shopping.</Link>
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
            <strong>Total:</strong> ₺{total.toFixed(2)}
          </div>
          <button className={styles.place} onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      )}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </main>
  )
}

export default CheckoutPage
