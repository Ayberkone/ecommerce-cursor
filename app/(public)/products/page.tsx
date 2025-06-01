'use client'

import { useEffect, useRef, useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import styles from './ProductsPage.module.scss'
import type { Category, Product } from '@/types/Product'
import { fetchProducts } from "@/utils/products"
import { fetchCategories } from "@/utils/admin/adminApi"

const DEBOUNCE_DELAY = 500

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For debouncing the search query
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State to hold the debounced query that triggers the API call
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_DELAY)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query])


  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const cats = fetchCategories()
        cats.then(res => setCategories(res))
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        // Call the exportable function
        const fetchedProducts = await fetchProducts(category, debouncedQuery, true)
        setProducts(fetchedProducts)
      } catch (err: any) {
        setError(err.message || 'Error fetching products')
      } finally {
        setLoading(false)
      }
    }
    getProducts()
    // Dependencies: fetch when category or debouncedQuery changes
  }, [category, debouncedQuery])

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Ürünler</h1>
      <div className={styles.productFilters}>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => (
            <option key={c?._id} value={c?._id}>{c?.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.productGrid}>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : products.length === 0 ? (
          <div>Ürün bulunamadı.</div>
        ) : (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </main>
  )
}

export default ProductsPage