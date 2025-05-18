'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import styles from './ProductsPage.module.scss'

const allProducts = [
  {
    id: 1,
    name: 'Vitamin C 1000mg',
    price: 129.99,
    specialPrice: 114.99,
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
  // ...add more for realism
]

const categories = Array.from(new Set(allProducts.map(p => p.category)))

const ProductsPage = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  const filtered = allProducts.filter(product =>
    (!category || product.category === category) &&
    (!query || product.name?.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>All Products</h1>
      <div className={styles.productFilters}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className={styles.productGrid}>
        {filtered.length === 0 ? (
          <div>No products found.</div>
        ) : (
          filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </main>
  )
}

export default ProductsPage
