'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import styles from './HomeSlider.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Slide = {
  id: string
  image: string
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

const slides: Slide[] = [
  {
    id: '1',
    image: '/img/slider/slider_1.webp',
    title: 'Yaza Özel İndirimler',
    description: 'En popüler takviye ve vitaminlerde büyük kampanya!',
    ctaText: 'Alışverişe Başla',
    ctaLink: '/products'
  },
  {
    id: '2',
    image: '/img/slider/slider_2.webp',
    title: 'Eczacılara Özel Fırsatlar',
    description: 'Kurumsal müşterilere avantajlı fiyatlar.',
    ctaText: 'Bize Katılın',
    ctaLink: '/register'
  },
  {
    id: '3',
    image: '/img/slider/slider_3.webp',
    title: 'Hızlı Teslimat',
    description: 'Aynı gün kargo, ertesi gün kapınızda!',
    ctaText: 'Kampanyaları Gör',
    ctaLink: '/campaigns'
  }
]

export default function HomeSlider() {
  return (
    <div className={styles.sliderWrap}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop
        navigation
        pagination={{ clickable: true }}
        // autoplay={{ delay: 4500, disableOnInteraction: false }}
        className={styles.swiper}
      >
        {slides.map(slide => (
          <SwiperSlide key={slide.id}>
            <div
              className={styles.slide}
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className={styles.overlay}>
                {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
                {slide.description && <div className={styles.desc}>{slide.description}</div>}
                {slide.ctaText && slide.ctaLink && (
                  <a href={slide.ctaLink} className={styles.cta}>{slide.ctaText}</a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
