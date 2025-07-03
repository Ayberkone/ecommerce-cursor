'use client'

import styles from './ProductCard.module.scss'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/context/AuthContext/AuthContext'
import { toast } from 'sonner'
import Image from 'next/legacy/image'
import Link from "next/link"
import { Product } from "@/types/Product"

type Props = {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart()
  const { user } = useAuth()

  // Use first photo as image
  const imageUrl = product.photoUrls?.[0] || '/placeholder.png'

  // If you have product detail page route, generate URL here
  const detailUrl = `/products/${product.slug || product._id}`

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to detail when clicking "Sepete Ekle"
    addToCart({
      ...product,
      id: product._id ?? '',
      price: product.calculatedPrice || product.price.regular || 0,
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
            width={240}
            height={240}
            objectFit="contain"
            priority
          />
        </div>
        <div className={styles.title}>{product?.name || '-'}</div>
        <div className={styles.price}>
          ₺{product.calculatedPrice !== undefined ? product.calculatedPrice.toFixed(2) : '-'}
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