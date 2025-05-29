'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import styles from './ProductsPage.module.scss'
import { api } from '@/utils/api'
import type { Product } from '@/types/Product'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from backend API
  useEffect(() => {
    setLoading(true)
    setError(null)
    api<{ products: Product[] }>('/api/products')
      .then(res => setProducts(res.products || []))
      .catch(err => setError(err.message || 'Error fetching products'))
      .finally(() => setLoading(false))
  }, [])

  // When category or query changes, refetch
  useEffect(() => {
    setLoading(true)
    setError(null)
    const url = `/api/products?${category ? `category=${category}&` : ''}${query ? `q=${encodeURIComponent(query)}` : ''}`
    api<{ products: Product[] }>(url)
      .then(res => setProducts(res.products || []))
      .catch(err => setError(err.message || 'Error fetching products'))
      .finally(() => setLoading(false))
  }, [category, query])

  // Dynamic category list (may want to fetch categories from backend in real app)
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  // Filtered products
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
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div>No products found.</div>
        ) : (
          filtered.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </main>
  )
}

export default ProductsPage