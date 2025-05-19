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
    <>
      <HomeSlider />
      <main>
        <Section id="brand-gallery">
          <BrandGallery />
        </Section>
        <Section id="videolar">
          <VideosSection />
        </Section>
      </main>
    </>
  )
}

export default HomePage
