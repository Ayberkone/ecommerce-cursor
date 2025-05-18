'use client'

import styles from './ProductCard.module.scss'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/components/AuthContext/AuthContext'
import Toast from '@/components/Toast/Toast'
import { useState } from 'react'
import Image from 'next/image'

type Product = {
  id: number
  name?: string
  price?: number
  specialPrice?: number
  imageUrl?: string
}

type Props = {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [toast, setToast] = useState('')

  // Show special price if user is a pharmacy/doctor and specialPrice exists
  const showSpecial = user && ['pharmacy', 'doctor'].includes(user.type) && product.specialPrice
  const displayPrice = showSpecial ? product.specialPrice : product.price

  const handleAdd = () => {
    addToCart({
      ...product,
      price: displayPrice,
    })
    setToast('Added to cart!')
  }

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={product?.imageUrl || '/placeholder.png'}
          alt={product?.name || '-'}
          width={120}
          height={120}
          style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
          priority
        />
      </div>
      <div className={styles.title}>{product?.name || '-'}</div>
      <div className={styles.price}>
        ₺{displayPrice !== undefined ? displayPrice.toFixed(2) : '-'}
        {showSpecial && (
          <span className={styles.specialLabel}>Special Price</span>
        )}
      </div>
      <button className={styles.button} onClick={handleAdd}>
        Add to Cart
      </button>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ProductCard
