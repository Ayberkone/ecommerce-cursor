'use client'

import Link from 'next/link'
import styles from './SuccessPage.module.scss'
import { CheckCircle } from 'lucide-react'

const SuccessPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.iconWrap}>
        <CheckCircle size={72} className={styles.icon} />
      </div>
      <h1 className={styles.title}>Thank you for your order!</h1>
      <p className={styles.text}>
        Your order was placed successfully.<br />
        You’ll receive a confirmation email soon.
      </p>
      <Link href="/products" className={styles.button}>
        Continue Shopping
      </Link>
    </main>
  )
}

export default SuccessPage
