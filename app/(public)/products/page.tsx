'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import styles from './ProductsPage.module.scss'
// import { products } from "../api/products/route"
import { products } from "@/lib/products"

const categories = Array.from(new Set(products.map(p => p.category)))

const ProductsPage = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  // const [products, setProducts] = useState([])

  // useEffect(() => {
  //   fetch('/api/products')
  //     .then(res => res.json())
  //     .then(setProducts)
  // }, [])

  const filtered = products.filter(product =>
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
