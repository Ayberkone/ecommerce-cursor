'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation';
import styles from './BrandGallery.module.scss'
import Image from "next/legacy/image"
import Link from "next/link"
import { fetchCategories } from "@/utils/admin/adminApi"
import { fetchProducts } from "@/utils/products"
import { Category, Product } from "@/types/Product"
import { CategoryIcon } from "../CategoryIcon/CategoryIcon"

const brandLogo = '/img/FarmalinkLogo.png'

export default function BrandGallery() {
  const [selectedType, setSelectedType] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtered = selectedType === 'all'
    ? products
    : products.filter((p: Product) => p?.category?._id === selectedType)

  useEffect(() => {
    async function load() {
      try {
        const [cats, products] = await Promise.all([
          fetchCategories(),
          fetchProducts({})
        ])
        setCategories([{ _id: 'all', name: 'Tüm Ürünler' }, ...cats])
        setSelectedType('all')
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
        <div className={styles.brandArea}>
          <div className={styles.brandRow}>
            <Image
              src={brandLogo}
              alt="Farmalink"
              title="Farmalink logo"
              width={300}
              height={76}
              className={styles.brandLogo}
            />
            <span className={styles.brandFamily}>AİLESİ</span>
            <span className={styles.brandFamily}>ÜRÜNLERİMİZ</span>
            <Link href="/products" className={styles.showAllBtn}>
              Ürünlere Göz At
            </Link>
          </div>
          <div className={styles.alan}>
            <div className={styles.typeBtns}>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedType(cat._id)}
                  className={selectedType === cat._id ? styles.active : ""}
                  type="button"
                >
                  <div
                    className={styles.turadi}
                    style={{
                      color:
                        cat.name === "Jel"
                          ? "#43bfa3"
                          : cat.name === "Gargara"
                            ? "#ae9bed"
                            : cat.name === "Sprey"
                              ? "#52b9fe"
                              : cat.name === "Şırınga"
                                ? "#dac87d"
                                : cat.name === "Diş ve Diş Eti Macunu"
                                  ? "#23539b"
                                  : undefined,
                    }}
                  >
                    {cat.name}
                  </div>
                  <CategoryIcon className={styles.categoryIcon} name={cat.name} selected={selectedType === cat._id} />
                </button>
              ))}
            </div>
            <div className={styles.slideArea}>
              {filtered?.length > 0 && (
                <>
                  <Swiper
                    modules={[Navigation]}
                    navigation={{
                      nextEl: `.${styles.swiperButtonNext}`,
                      prevEl: `.${styles.swiperButtonPrev}`,
                    }}
                    loop
                    slidesPerView={1}
                    grabCursor
                    spaceBetween={18}
                    className={styles.swiper}
                  >
                    {filtered.map((prod: Product) => (
                      <SwiperSlide key={prod._id}>
                        <div className={styles.productCard}>
                          <Link href={`/products/${prod._id}`} className={styles.productLink}>
                            <div className={styles.productImageWrapper}>
                              <Image
                                src={prod.photoUrls?.[0] || '/img/placeholder.png'}
                                alt={prod.name}
                                layout="fill"
                                objectFit="contain"
                                priority
                                className={styles.productImage}
                              />
                            </div>
                            <div className={styles.productInfo}>
                              <div className={styles.productName}>{prod.name}</div>
                              {prod.price && (
                                <div className={styles.productPrice}>{prod.price.regular} ₺</div>
                              )}
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className={`${styles.swiperButtonPrev} swiper-button-prev`}></div>
                  <div className={`${styles.swiperButtonNext} swiper-button-next`}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
