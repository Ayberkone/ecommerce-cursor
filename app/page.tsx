'use client'

import BrandGallery from "@/components/BrandGallery/BrandGallery"
import HomeSlider from "@/components/HomeSlider/HomeSlider"
import ProductCard from '@/components/ProductCard/ProductCard'
import Section from "@/components/Section/Section"
import VideosSection from "@/components/VideosSection/VideosSection"
import Link from 'next/link'

const sampleProducts = [
  {
    id: 1,
    name: 'Vitamin C 1000mg',
    price: 129.99,
    imageUrl: '/product-sample-1.jpg',
  },
  {
    id: 2,
    name: 'Omega 3 Fish Oil',
    price: 199.0,
    imageUrl: '/product-sample-2.jpg',
  },
  {
    id: 3,
    name: 'Zinc Tablets',
    price: 79.5,
    imageUrl: '/product-sample-3.jpg',
  },
  {
    id: 4,
    name: 'Propolis Spray',
    price: 59.99,
    imageUrl: '/product-sample-4.jpg',
  },
]

const HomePage = () => {
  return (
    <main>
      <Section id="videolar">
        <HomeSlider />
      </Section>
      <Section id="videolar">
        <BrandGallery />
      </Section>
      <Section id="videolar">
        <VideosSection />
      </Section>
      {/* <section>
        <h2 className="section-title">Bestsellers</h2>
        <div className="product-grid">
          {sampleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section> */}
    </main>
  )
}

export default HomePage
