'use client'

import { notFound, useRouter } from 'next/navigation'
import { CartItem, useCart } from '@/components/CartContext'
import { toast } from 'sonner'
import styles from './ProductDetail.module.scss'
import React, { useEffect, useState, use } from 'react';
import ReviewList from "@/components/ReviewList/ReviewList"
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery"
import Image from "next/image"
import type { Product, Review } from '@/types/Product'
import { useAuth } from "@/context/AuthContext/AuthContext"
import { fetchProductById, fetchReviewsByProductId } from "@/utils/products"
import { ArrowLeft } from "lucide-react"
import DOMPurify from 'dompurify'
import { CategoryIcon } from "@/components/CategoryIcon/CategoryIcon"
import { ReviewForm } from "@/components/ReviewForm/ReviewForm"
import { addReview, updateReview, deleteReview } from "@/utils/reviewsApi"
import Link from "next/link"

const productTabs = [
  { key: 'description', label: 'Açıklama' },
  { key: 'usage', label: 'Kullanım Şekli' }
]

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'usage'>('description')
  const [canReview, setCanReview] = useState(false)
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [reviewLoading, setReviewLoading] = useState(true)

  // Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedProduct = await fetchProductById(params.id)
        setProduct(fetchedProduct)
      } catch (err: any) {
        setError(err.message || "Ürün bulunamadı")
      } finally {
        setLoading(false)
      }
    }
    getProduct()
  }, [params.id])

  useEffect(() => {
    if (product?._id) {
      const getReviews = async () => {
        try {
          const fetchedReviews = await fetchReviewsByProductId(product._id)
          setReviews(fetchedReviews)
        } catch (err) {
          setReviews([])
        }
      }
      getReviews()
    }
  }, [product?._id])

  useEffect(() => {
    if (!user || !product?._id) {
      setCanReview(false)
      setMyReview(null)
      setReviewLoading(false)
      return
    }
    setReviewLoading(true)
    // Check if already reviewed
    const existingReview = reviews.find(r => r.user === user.id)
    setMyReview(existingReview || null)
    // If not reviewed, check order history
    if (!existingReview) {
      // Optional: if you have an endpoint to check order history, use it.
      // Or handle on submit by error.
      setCanReview(true) // Allow attempt, backend will enforce real permission
    } else {
      setCanReview(false)
    }
    setReviewLoading(false)
  }, [user, product?._id, reviews])

  if (loading) return <div>Yükleniyor...</div>
  if (error || !product) return notFound()

  // Handle add to cart
  const handleAdd = () => {
    const _product: CartItem = {
      id: product._id ?? '',
      name: product.name,
      price: user?.type !== 'regular' && product.price.pro ? product.price.pro : product.price.regular,
      quantity,
      image: product.photoUrls?.[0] || '/placeholder.png',
    }
    addToCart(_product, quantity)
    toast.success('Sepete eklendi!')
  }

  // Example tab contents (customize as needed)
  const description = <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description?.normal) || "-" }} />
  const usage = (
    <div dangerouslySetInnerHTML={{ __html: product?.usage ? DOMPurify.sanitize(product?.usage) : "Kullanım talimatı yakında eklenecek." }} />
  )

  return (
    <main className={styles.main}>
      {/* Go back button */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => router.push('/products')}
        aria-label="Ürünlere Geri Dön"
      >
        <ArrowLeft size={24} />
        Ürünlere Dön
      </button>
      <div className={styles.productDetailContainer}>
        <PhotoGallery images={product.photoUrls || []} />
        <div className={styles.productSummary}>
          <h1 className={styles.productName}>{product.name || '-'}</h1>
          <div className={styles.productShortInfo}>
            {product?.category && (
              <span className={styles.formInfo}>
                <b>Form</b>
                <div className={styles.turadi}>
                  <div
                    style={{
                      color:
                        product?.category?.name === "Jel"
                          ? "#43bfa3"
                          : product?.category?.name === "Gargara"
                            ? "#ae9bed"
                            : product?.category?.name === "Sprey"
                              ? "#52b9fe"
                              : product?.category?.name === "Şırınga"
                                ? "#dac87d"
                                : product?.category?.name === "Diş ve Diş Eti Macunu"
                                  ? "#23539b"
                                  : undefined,
                    }}
                  >
                    {product?.category?.name}
                  </div>
                  <CategoryIcon className={styles.categoryIcon} name={product?.category?.name} />
                </div>
              </span>
            )}
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
            <div className={styles.price}>
              <span className={styles.priceValue}>₺{product.calculatedPrice?.toFixed(2) || '-'}</span>
            </div>
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
        {/* REVIEW FORM OR STATUS */}
        <section style={{ marginBottom: 24 }}>
          {reviewLoading ? (
            <div>Yükleniyor…</div>
          ) : !user ? (
            <div className="text-muted">Yorum yazmak için <Link className="link" href="/login">giriş</Link> yapmalısınız.</div>
          ) : myReview ? (
            <div>
              <div className="text-success" style={{ marginBottom: 6 }}>Yorumunuz kaydedildi.</div>
              <ReviewForm
                initialRating={myReview.rating}
                initialComment={myReview.comment}
                loading={reviewLoading}
                onSubmit={async (rating, comment) => {
                  setReviewLoading(true)
                  try {
                    await updateReview(myReview.id, { rating, comment })
                    // Refresh reviews
                    const updated = await fetchReviewsByProductId(product._id)
                    setReviews(updated)
                    toast.success("Yorum güncellendi.")
                  } catch (e: any) {
                    toast.error(e?.message || "Yorum güncellenemedi")
                  } finally {
                    setReviewLoading(false)
                  }
                }}
              />
              <button
                className="btn btn-danger"
                style={{ marginTop: 8 }}
                disabled={reviewLoading}
                onClick={async () => {
                  if (!window.confirm("Yorumu silmek istediğinize emin misiniz?")) return
                  setReviewLoading(true)
                  try {
                    await deleteReview(myReview.id)
                    setMyReview(null)
                    setReviews(await fetchReviewsByProductId(product._id))
                    toast.success("Yorum silindi.")
                  } catch (e: any) {
                    toast.error(e?.message || "Yorum silinemedi")
                  } finally {
                    setReviewLoading(false)
                  }
                }}
              >Yorumu Sil</button>
            </div>
          ) : canReview ? (
            <ReviewForm
              loading={reviewLoading}
              onSubmit={async (rating, comment) => {
                setReviewLoading(true)
                try {
                  await addReview({ productId: product._id, rating, comment })
                  setReviews(await fetchReviewsByProductId(product._id))
                  toast.success("Yorum eklendi.")
                } catch (e: any) {
                  if (e.message?.includes("satın aldığınız")) {
                    toast.error("Yalnızca satın aldığınız ürünlere yorum yapabilirsiniz.")
                  } else if (e.message?.includes("yorum yaptınız")) {
                    toast.error("Bu ürüne daha önce yorum yaptınız.")
                  } else {
                    toast.error(e?.message || "Yorum eklenemedi")
                  }
                } finally {
                  setReviewLoading(false)
                }
              }}
            />
          ) : (
            <div className="text-muted">
              {user
                ? "Yalnızca satın aldığınız ürünlere yorum yazabilirsiniz."
                : <>Yorum yazmak için <button className="link" onClick={() => router.push('/login')}>giriş yapmalısınız</button>.</>}
            </div>
          )}
        </section>
        <ReviewList reviews={reviews} />
      </section>
    </main>
  )
}