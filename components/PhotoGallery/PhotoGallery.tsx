'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './PhotoGallery.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Thumbs, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import Modal from "../Modal/Modal"

interface PhotoGalleryProps {
  images: string[]
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const mainSwiperRef = useRef<any>(null)

  // Fix: Reconnect thumbs after both swipers mounted
  useEffect(() => {
    if (mainSwiperRef.current && thumbsSwiper && !thumbsSwiper.destroyed) {
      // Force update and sync
      mainSwiperRef.current.thumbs.swiper = thumbsSwiper
      mainSwiperRef.current.thumbs.init()
      mainSwiperRef.current.update()
      mainSwiperRef.current.slideTo(activeIndex)
    }
  }, [thumbsSwiper, activeIndex])

  if (!images || images.length === 0) {
    return (
      <div className={styles.resimler}>
        <div className={styles.mainPhoto}>
          <Image
            src="/placeholder.png"
            alt="Ürün resmi bulunamadı"
            width={340}
            height={340}
            className={styles.anaresim}
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.resimler}>
        <div className={styles.mainPhotoGallery}>
          <Swiper
            onSwiper={swiper => {
              mainSwiperRef.current = swiper
            }}
            onSlideChange={swiper => {
              setActiveIndex(swiper.activeIndex)
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Thumbs, Keyboard]}
            spaceBetween={10}
            slidesPerView={1}
            loop={images.length > 1}
            keyboard
            className={styles.mainProductSwiper}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={styles.anaresimWrap}
                  tabIndex={0}
                  onClick={() => setModalOpen(true)}
                  aria-label="Fotoğrafı büyüt"
                  role="button"
                  style={{ cursor: 'zoom-in' }}
                >
                  <Image
                    src={img}
                    alt={`Ürün görseli ${index + 1}`}
                    className={styles.anaresim}
                    priority
                    loading="eager"
                    width={340}
                    height={340}
                  />
                  <span className={styles.expandIcon}>🔍</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.thumbnailsGallery}>
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            spaceBetween={8}
            slidesPerView={Math.min(images.length, 6)}
            watchSlidesProgress
            direction="vertical"
            className={styles.productThumbsSwiper}
            freeMode
          >
            {images.map((img, index) => (
              <SwiperSlide
                key={index}
                className={`${styles.thumbnailSlide} ${activeIndex === index ? styles.activeThumb : ''}`}
                onClick={() => setActiveIndex(index)}
                tabIndex={0}
                role="button"
                aria-label={`Küçük ürün görseli ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`Küçük ürün görseli ${index + 1}`}
                  width={100}
                  height={80}
                  className={styles.thumbnailImage}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Modal (expand image) */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Image
          src={images[activeIndex]}
          alt={`Büyük ürün görseli ${activeIndex + 1}`}
          width={900}
          height={900}
          className={styles.modalImage}
          style={{
            color: 'transparent',
            objectFit: 'contain',
            width: '100%',
            height: '100%'
          }}
          loading="eager"
        />
      </Modal>
    </>
  )
}