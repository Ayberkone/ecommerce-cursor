'use client'

import styles from './ProductCard.module.scss'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/context/AuthContext/AuthContext'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from "next/link"
import { Product } from "@/types/Product"

type Props = {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart()
  const { user } = useAuth()

  // Determine price variant
  // If user is pharmacy/doctor, show "pro" price if available; else show regular price.
  let displayPrice = product.price?.regular
  let specialPriceLabel = null
  if (user && ['pharmacy', 'doctor'].includes(user.type)) {
    if (product.price?.pro) {
      displayPrice = product.price.pro
      specialPriceLabel = 'Eczane/Doktor Fiyatı'
    } else if (product.price?.storage) {
      displayPrice = product.price.storage
      specialPriceLabel = 'Depo Fiyatı'
    }
  }

  // Use first photo as image
  const imageUrl = product.photoUrls?.[0] || '/placeholder.png'

  // If you have product detail page route, generate URL here
  const detailUrl = `/products/${product._id}`

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to detail when clicking "Sepete Ekle"
    addToCart({
      ...product,
      id: product._id ?? '',
      price: displayPrice,
      image: imageUrl
    }, 1)
    toast.success('Sepete eklendi!')
  }

  return (
    <Link href={detailUrl} className={styles.productImg}>
      <div className={styles.card}>
        <div className={styles.image}>
          <Image
            src={imageUrl}
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
          {specialPriceLabel && (
            <span className={styles.specialLabel}>{specialPriceLabel}</span>
          )}
        </div>
        <button
          className={styles.button}
          onClick={handleAdd}
          tabIndex={0}
        >
          Sepete Ekle
        </button>
      </div>
    </Link>
  )
}

export default ProductCard