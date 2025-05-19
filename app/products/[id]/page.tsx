'use client'

import { notFound } from 'next/navigation'
import { CartItem, useCart } from '@/components/CartContext'
import { toast } from 'sonner'
import styles from './ProductDetail.module.scss'
import React, { useEffect, useState } from 'react'
import ReviewList from "@/components/ReviewList/ReviewList"
import { products } from "@/lib/products"
// import { products } from "@/app/api/products/route"
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery"
import Image from "next/image"

type ProductDetailPageProps = {
  id: string
}

const productTabs = [
  { key: 'description', label: 'Açıklama' },
  { key: 'usage', label: 'Kullanım Şekli' },
]

const sampleReviews = [
  { id: 1, user: 'Ayberk B.', rating: 5, comment: 'Hızlı kargo, mükemmel ürün!', date: '2024-05-01' },
  { id: 2, user: 'Zeynep Y.', rating: 4, comment: 'Diş etlerimde rahatlama hissettim.', date: '2024-05-02' },
  { id: 3, user: 'Mehmet C.', rating: 3, comment: 'Kullanımı kolay, etkili.', date: '2024-05-04' },
]

export default function ProductDetailPage({ params }: { params: Promise<ProductDetailPageProps> }) {
  const actualParams = React.use(params)
  const product = products.find(p => p.url.includes(String(actualParams.id)))
  const { addToCart } = useCart()
  const [reviews, setReviews] = useState(sampleReviews)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'usage'>('description')

  useEffect(() => {
    fetch(`/api/reviews?productId=${actualParams.id}`)
      .then(res => res.json())
      .then(setReviews)
  }, [actualParams.id])

  if (!product) return notFound()

  const handleAdd = () => {
    const _product: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]
    }
    addToCart(_product, quantity) // Make sure your addToCart accepts quantity
    toast.success('Sepete eklendi!')
  }

  // Example descriptions (replace with your actual data or fields)
  const description = (
    <>
      <p>
        4 kat fazla yüksek moleküler ağırlıklı hyaluronik asit içeriği ile dokuda maksimum tutunma ve durulama sağlar.
        Ağız, diş ve diş etini kaplamak için özel olarak formüle edilmiştir. Ayrıca ağız dokusunda daha uzun süre tutunmasını sağlayan özgün bir Biyo-yapışkan matris içerir.
      </p>
      <ul>
        <li>Yüksek saflıkta hyaluronik asit içerir.</li>
        <li>Diş eti problemlerinde güvenle kullanılır.</li>
        <li>Alkol ve SLS içermez.</li>
      </ul>
    </>
  )

  const usage = (
    <>
      <p>
        Günde 3-5 defa, tercihen yemeklerden sonra doğrudan sorunlu bölgeye püskürtülerek uygulanır. Uygulamadan sonra en az 30 dakika yemek yenilmemeli, bir şey içilmemelidir.
      </p>
      <ul>
        <li>Kullanımdan önce çalkalayınız.</li>
        <li>Çocukların ulaşamayacağı yerde saklayınız.</li>
      </ul>
    </>
  )

  return (
    <main className={styles.main}>
      <div className={styles.productDetailContainer}>
        <PhotoGallery images={product.images} />
        {/* SUMMARY */}
        <div className={styles.productSummary}>
          <h1 className={styles.productName}>{product.name || '-'}</h1>
          <div className={styles.price}>
            <span className={styles.priceValue}>₺{product.price?.toFixed(2) || '-'}</span>
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
                <b>Form</b> <span>{product?.type || 'Sprey'}</span>
              </span>
            </span>
            <span>{product?.productShortInfo || 'Ameliyat süresi ve sonrası dönemde yaralara uygulamak için idealdir. Etkili, hızlı ve uygulaması kolay kullanım sağlamak için özel olarak tasarlanmıştır.'}</span>
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