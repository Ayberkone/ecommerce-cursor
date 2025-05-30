'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from './BrandGallery.module.scss'
import Image from "next/image"
import Link from "next/link"
import { fetchCategories } from "@/utils/admin/adminApi"
import { fetchProducts } from "@/utils/products"
import { Category, Product } from "@/types/Product"

const brandLogo = '/img/FarmalinkLogo.png'

export default function BrandGallery() {
  const [selectedType, setSelectedType] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtered = selectedType === 'all'
    ? products
    : products.filter((p: Product) => p?.category?.name === selectedType)

  useEffect(() => {
    async function load() {
      try {
        const [cats, products] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ])
        setCategories(cats)
        setProducts(products)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div>Yükleniyor...</div>
  if (error) return <div>Ürünler alınamadı.</div>

  return (
    <section id="markaalan" className={styles.section}>
      <div className="container">
        <div className={styles.alan}>
          <div className={styles.brandRow}>
            <Image
              src={brandLogo}
              alt="Farmalink"
              title="Farmalink logo"
              width={76}
              height={76}
              className={styles.brandLogo}
            />
            <span className={styles.brandFamily}>AİLESİ</span>
            <Link href="/products" className={styles.showAllBtn}>
              Tümünü Göster
            </Link>
          </div>
          <div className={styles.typeBtns}>
            {categories.map((t: Category) => (
              <button
                key={t._id}
                onClick={() => setSelectedType(t._id)}
                type="button"
              >
                <div className={styles.uruntur}>
                  <div className={styles.icon}>
                  </div>
                  <div className={styles.turadi}>
                    {t._id !== 'all' && <span>Form</span>}
                    {t.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filtered?.length > 0 && (
            <div className={styles.slideArea}>
              <Swiper
                modules={[Navigation]}
                loop
                slidesPerView={1}
                spaceBetween={18}
                className={styles.swiper}
                navigation={{
                  nextEl: '.brandGalleryNext',
                  prevEl: '.brandGalleryPrev'
                }}
                breakpoints={{
                  600: { slidesPerView: 2 },
                  900: { slidesPerView: 3 },
                  1200: { slidesPerView: 3 }
                }}
              >
                {filtered.map((prod: Product) => (
                  <SwiperSlide key={prod._id}>
                    <div className={styles.productCard}>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className={`${styles.brandGalleryPrev} swiper-button-prev`} tabIndex={0} aria-label="Prev" />
              <button className={`${styles.brandGalleryNext} swiper-button-next`} tabIndex={0} aria-label="Next" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
