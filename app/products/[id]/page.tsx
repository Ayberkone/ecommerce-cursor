'use client'

import { notFound } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import Toast from '@/components/Toast/Toast'
import styles from './ProductDetail.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import ReviewList from "@/components/ReviewList/ReviewList"
import ReviewForm from "@/components/ReviewForm/ReviewForm"

const sampleReviews = [
  {
    id: 1,
    user: 'Ayberk B.',
    rating: 5,
    comment: 'Great quality, fast shipping!',
    date: '2024-05-01',
  },
  {
    id: 2,
    user: 'Zeynep Y.',
    rating: 4,
    comment: 'Really helped with my immune system.',
    date: '2024-05-02',
  },
  {
    id: 3,
    user: 'Mehmet C.',
    rating: 3,
    comment: 'It’s okay, but packaging could be better.',
    date: '2024-05-04',
  },
]


const allProducts = [
  {
    id: 1,
    name: 'Vitamin C 1000mg',
    price: 129.99,
    imageUrl: '/product-sample-1.jpg',
    category: 'Supplements',
  },
  {
    id: 2,
    name: 'Omega 3 Fish Oil',
    price: 199.0,
    imageUrl: '/product-sample-2.jpg',
    category: 'Supplements',
  },
  {
    id: 3,
    name: 'Zinc Tablets',
    price: 79.5,
    imageUrl: '/product-sample-3.jpg',
    category: 'Minerals',
  },
  {
    id: 4,
    name: 'Propolis Spray',
    price: 59.99,
    imageUrl: '/product-sample-4.jpg',
    category: 'Sprays',
  },
]

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  const product = allProducts.find(p => String(p.id) === params.id)
  const { addToCart } = useCart()
  const [toast, setToast] = useState('')
  const [reviews, setReviews] = useState(sampleReviews)

  useEffect(() => {
    fetch(`/api/reviews?productId=${params.id}`)
      .then(res => res.json())
      .then(setReviews)
  }, [params.id])

  if (!product) return notFound()

  const handleReviewSubmit = review => {
    setReviews([
      { ...review, id: Date.now(), date: new Date().toISOString().slice(0, 10) },
      ...reviews
    ])
  }

  const handleAdd = () => {
    addToCart(product)
    setToast('Added to cart!')
  }

  return (
    <main className={styles.main}>
      <div className={styles.productDetail}>
        <div className={styles.image}>
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name || '-'}
            width={300}
            height={300}
            style={{ objectFit: 'cover', borderRadius: '1rem' }}
            priority
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.name || '-'}</h1>
          <div className={styles.price}>₺{product.price?.toFixed(2) || '-'}</div>
          <div className={styles.category}>{product.category || '-'}</div>
          <button className={styles.add} onClick={handleAdd}>
            Add to Cart
          </button>
          <ReviewForm onSubmit={handleReviewSubmit} />
          <ReviewList reviews={sampleReviews} />
          {toast && <Toast message={toast} onClose={() => setToast('')} />}
        </div>
      </div>
    </main>
  )
}

export default ProductDetailPage
