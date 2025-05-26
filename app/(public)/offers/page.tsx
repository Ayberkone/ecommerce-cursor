'use client'

import styles from './Offers.module.scss'
import { bundles } from '@/content/bundles'
import { GalleryProduct, products } from "@/lib/products"
import { useCart } from '@/components/CartContext'
import { motion } from 'framer-motion'
import { useMemo } from "react"
import Image from 'next/image'


export default function OffersPage() {
  const { addToCart } = useCart()

  const bundlesWithProducts = useMemo(() =>
    bundles.map(bundle => ({
      ...bundle,
      products: bundle.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as GalleryProduct[]
    })), [])

  return (
    <main className={styles.offersMain}>
      <h1 className={styles.title}>Kampanyalı Paketler</h1>
      <div className={styles.bundleGrid}>
        {bundlesWithProducts.map(bundle => (
          <motion.div
            className={styles.bundleCard}
            key={bundle.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: bundle.id * 0.1 }}
          >
            <div className={styles.bundleImageArea}>
              <Image
                src={bundle.image}
                alt={bundle.name}
                className={styles.bundleImage}
                width={240}
                height={120}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className={styles.bundleInfo}>
              <h2 className={styles.bundleName}>{bundle.name}</h2>
              <ul className={styles.productList}>
                {bundle.products.map(p => (
                  <li key={p.id}>
                    <Image
                      src={p.typeIcon}
                      alt={p.name}
                      width={32}
                      height={32}
                      className={styles.productIcon}
                      style={{ objectFit: 'contain' }}
                    />
                    <span>{p.name}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.prices}>
                <span className={styles.oldPrice}>₺{bundle.oldPrice}</span>
                <span className={styles.bundlePrice}>₺{bundle.bundlePrice}</span>
              </div>
              <button
                className={styles.addCartBtn}
                onClick={() => {
                  bundle.products.forEach(product => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.specialPrice || product.price,
                      image: product.images[0]
                    })
                  })
                }}
              >
                Sepete Ekle
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}