'use client'

import { notFound, useRouter } from 'next/navigation'
import { CartItem, useCart } from '@/components/CartContext'
import { toast } from 'sonner'
import styles from './ProductDetail.module.scss'
import React, { useEffect, useState } from 'react'
import ReviewList from "@/components/ReviewList/ReviewList"
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery"
import Image from "next/image"
import { api } from "@/utils/api"
import type { Product, Review } from '@/types/Product'
import { useAuth } from "@/context/AuthContext/AuthContext"

const productTabs = [
  { key: 'description', label: 'Açıklama' },
  { key: 'usage', label: 'Kullanım Şekli' }
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter() // Initialize useRouter
  const resolvedParams = React.use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'usage'>('description')

  // Fetch product data from backend
  useEffect(() => {
    setLoading(true)
    setError(null)
    api<Product>(`/api/products/${resolvedParams.id}`, { showLoader: true })
      .then(setProduct)
      .catch(() => setError("Ürün bulunamadı"))
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  // Fetch reviews from backend
  useEffect(() => {
    api<Review[]>(`/api/reviews?productId=${resolvedParams.id}`, { showLoader: true })
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [resolvedParams.id])

  if (loading) return <div>Yükleniyor...</div>
  if (error || !product) return notFound()

  // Handle add to cart
  const handleAdd = () => {
    const _product: CartItem = {
      id: product._id ?? '',
      name: product.name,
      price: user?.type !== 'regular' && product.price.pro ? product.price.pro : product.price.regular,
      quantity,
      image: product.photoUrls?.[0] || '/placeholder.png', // Fallback image
    }
    addToCart(_product, quantity)
    toast.success('Sepete eklendi!')
  }

  // Example tab contents (customize as needed)
  const description = (
    <div>
      <p>{product?.description?.normal || "-"}</p>
      {product?.keywords && (
        <ul>
          {product.keywords.map((k, i) => <li key={i}>{k}</li>)}
        </ul>
      )}
    </div>
  )
  const usage = (
    <div>
      <p>{product?.description?.mini || "Kullanım talimatı yakında eklenecek."}</p>
    </div>
  )

  return (
    <main className={styles.main}>
      {/* Go back button */}
      <button
        className={styles.goBackBtn} // Add this class to your SCSS for styling
        onClick={() => router.push('/products')}
        aria-label="Ürünlere Geri Dön"
      >
        Ürünlere Git
      </button>
      <div className={styles.productDetailContainer}>
        <PhotoGallery images={product.photoUrls || []} />
        <div className={styles.productSummary}>
          <h1 className={styles.productName}>{product.name || '-'}</h1>
          <div className={styles.price}>
            <span className={styles.priceValue}>₺{product.price?.regular?.toFixed(2) || '-'}</span>
          </div>
          <div className={styles.productShortInfo}>
            <span className={styles.formInfo}>
              <div className={styles.icon}>
                <Image
                  src="/img/category-icons/jel.png"
                  alt="jel"
                  width={32}
                  height={32}
                  className={styles.brandLogo}
                />
              </div>
              <span className="flex-col">
                <b>Form</b> <span>{product?.category?.name}</span>
              </span>
            </span>
            <span>{product?.proDescription?.mini || product?.description?.mini || '-'}</span>
          </div>
          <div className={styles.counterRow}>
            <div className={styles.counter}>
              <button
                type="button"
                className={styles.counterBtn}
                aria-label="Azalt"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>
              <span className={styles.counterValue}>{quantity}</span>
              <button
                type="button"
                className={styles.counterBtn}
                aria-label="Arttır"
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
            <button className={styles.addCartBtn} onClick={handleAdd}>Sepete Ekle</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabsSection}>
        <div className={styles.tabs}>
          {productTabs.map(t => (
            <button
              key={t.key}
              className={styles.tab + ' ' + (tab === t.key ? styles.active : '')}
              onClick={() => setTab(t.key as 'description' | 'usage')}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.tabPanel}>
          {tab === 'description' ? description : usage}
        </div>
      </div>

      {/* REVIEWS */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Kullanıcı Yorumları</h2>
        <ReviewList reviews={reviews} />
      </section>
    </main>
  )
}