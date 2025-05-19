'use client'

import styles from './ProductCard.module.scss'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/components/AuthContext/AuthContext'
import { toast } from 'sonner'
import { useState } from 'react'
import Image from 'next/image'
import Link from "next/link"
import { GalleryProduct } from "@/lib/products"


type Props = {
  product: GalleryProduct
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart()
  const { user } = useAuth()

  // Show special price if user is a pharmacy/doctor and specialPrice exists
  const showSpecial = user && ['pharmacy', 'doctor'].includes(user.type) && product.specialPrice
  const displayPrice = showSpecial ? product.specialPrice : product.price

  const handleAdd = () => {
    addToCart({
      ...product,
      price: displayPrice,
      image: product.images[0]
    })
    toast.success('Added to cart!')
  }

  return (
    <Link href={product.url} className={styles.productImg}>
      <div className={styles.card}>
        <div className={styles.image}>
          <Image
            src={product?.images[0] || '/placeholder.png'}
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
      </div>
    </Link>
  )
}

export default ProductCard
