import { useState } from 'react'
import Image from 'next/image'
import styles from './PhotoGallery.module.scss'

interface PhotoGalleryProps {
  images: string[]
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [selected, setSelected] = useState(0)

  if (!images?.length) {
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
    <div className={styles.resimler}>
      <div className={styles.thumbnails}>
        {images.map(img =>
          <div
            key={img}
            className={`${styles.thumbnail} ${images[selected] === img ? styles.active : ''}`}
            onClick={() => setSelected(images.indexOf(img))}
            aria-label="Ürün küçük görseli"
          >
            <Image src={img} alt="" width={78} height={78} />
          </div>
        )}
      </div>
      <div className={styles.mainPhoto}>
        <Image
          src={images[selected]}
          alt="Ürün ana resmi"
          width={340}
          height={340}
          className={styles.anaresim}
          priority
        />
      </div>
    </div>
  )
}