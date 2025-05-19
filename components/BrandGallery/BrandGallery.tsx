'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from './BrandGallery.module.scss'
import Image from "next/image"
import { GalleryProduct } from "@/lib/products"
import Link from "next/link"

const brandLogo = '/img/FarmalinkLogo.png'

const productTypes = [
  {
    id: 'all',
    label: 'Tüm Ürünler',
    icon: '/img/category-icons/jel.png',
    color: ''
  },
  {
    id: 'jel',
    label: 'Jel',
    icon: '/img/category-icons/jel.png',
    color: ''
  },
  {
    id: 'gargara',
    label: 'Gargara',
    icon: '/img/category-icons/gargara.png',
    color: 'pembe'
  },
  {
    id: 'sprey',
    label: 'Sprey',
    icon: '/img/category-icons/spray.png',
    color: 'mavi'
  },
  {
    id: 'siringa',
    label: 'Şırınga',
    icon: '/img/category-icons/syringe.png',
    color: 'sari'
  },
  {
    id: 'macun',
    label: 'Diş ve Diş Eti Macunu',
    icon: '/img/category-icons/jel.png',
    color: ''
  }
]

export default function BrandGallery() {
  const [selectedType, setSelectedType] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtered = selectedType === 'all'
    ? products
    : products.filter((p: GalleryProduct) => p.type === selectedType)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
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
          </div>
          <div className={styles.brandProductsTitle}>ÜRÜNLER</div>
          <div className={styles.typeBtns}>
            {productTypes.map(t => (
              <button
                key={t.id}
                className={`${styles.typeBtn} ${selectedType === t.id ? styles.active : ''}`}
                onClick={() => setSelectedType(t.id)}
                type="button"
              >
                <div className={`${styles.uruntur} ${t.color ? styles[t.color] : ''}`}>
                  <div className={styles.icon}>
                    <Image
                      src={t.icon}
                      alt={t.label}
                      title={t.label}
                      width={76}
                      height={76}
                      className={styles.brandLogo}
                    />
                  </div>
                  <div className={styles.turadi}>
                    <span>Form</span>
                    {t.label}
                  </div>
                </div>
              </button>
            ))}
            <Link href="/products" className={styles.showAllBtn}>
              Tümünü Göster
            </Link>
          </div>
          <div className={styles.slideArea}>
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              loop
              spaceBetween={18}
              navigation={{
                nextEl: '.brandGallery-next',
                prevEl: '.brandGallery-prev'
              }}
              breakpoints={{
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 3 }
              }}
              className={styles.swiper}
            >
              {filtered.map((prod: GalleryProduct) => (
                <SwiperSlide key={prod.id}>
                  <div className={styles.productCard}>
                    <div className={`${styles.uruntur} ${prod.typeColor ? styles[prod.typeColor] : ''}`}>
                      <div className={styles.icon}>
                        <Image
                          src={prod.typeIcon}
                          alt={prod.typeLabel}
                          width={32}
                          height={32}
                          className={styles.iconImg}
                        />
                      </div>
                      <div className={styles.turadi}>
                        <span>Form</span>
                        {prod.typeLabel}
                      </div>
                    </div>
                    <a href={prod.url} className={styles.productImg}>
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        width={180}
                        height={180}
                        className={styles.productImg}
                      />
                    </a>
                    <div className={styles.productInfo}>
                      <div className={styles.left}>
                        <a href={prod.url} className={styles.productName}>{prod.name}</a>
                        <div className={styles.commentsRow}>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={styles.star}>★</span>
                            ))}
                          </div>
                          <div className={styles.commentCount}>{prod.comments} Yorum</div>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.price}>
                          <span>{prod.price}₺</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="brandGallery-prev swiper-button-prev" tabIndex={0} aria-label="Prev" />
            <button className="brandGallery-next swiper-button-next" tabIndex={0} aria-label="Next" />
          </div>
        </div>
      </div>
    </section>
  )
}
