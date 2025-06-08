'use client'

import Link from 'next/link'
import styles from './SuccessPage.module.scss'
import { CheckCircle } from 'lucide-react'

const PaymentSuccessPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.iconWrap}>
        <CheckCircle size={72} className={styles.icon} />
      </div>
      <h1>Ödeme Başarılı!</h1>
      <p className={styles.text}>
        Siparişiniz başarıyla alındı. Teşekkür ederiz!
      </p>
      <Link href="/my-orders" className={styles.button}>
        Siparişlerim
      </Link>
      <Link href="/products" className={styles.button}>
        Alışverişe Devam Et
      </Link>
    </main>
  )
}

export default PaymentSuccessPage
