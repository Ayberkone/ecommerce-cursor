'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import styles from './ProductsPage.module.scss'
import type { Category, Collection, Product } from '@/types/Product'
import { fetchProducts } from "@/utils/products"
import { fetchCategories, fetchCollections } from "@/utils/admin/adminApi"
import { ProductCardSkeletonList } from "@/components/ProductCard/ProductCardSkeleton"
import DOMPurify from 'dompurify'
import FilterButtonGroup from "./FilterButtonGroup"

const DEBOUNCE_DELAY = 500

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [collection, setCollection] = useState('')
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For debouncing the search query
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State to hold the debounced query that triggers the API call
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const collectionDescription = useMemo(() => {
    const desc = collections.find(c => c._id === collection)?.description || ''
    return desc ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} /> : null
  }, [collection, collections])

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
        const [cats, colls] = await Promise.all([
          fetchCategories(),
          fetchCollections(),
        ])
        setCategories(cats)
        setCollections(colls)
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
        const fetchedProducts = await fetchProducts({
          category,
          collections: collection ? [collection] : [],
          query: debouncedQuery,
          showLoader: true
        })
        setProducts(fetchedProducts)
      } catch (err: any) {
        setError(err.message || 'Error fetching products')
      } finally {
        setLoading(false)
      }
    }
    getProducts()
    // Dependencies: fetch when category or debouncedQuery changes
  }, [category, collection, debouncedQuery])

  return (
    <main className={styles.main}>
      <h2 className={styles.sectionTitle}>Ürün Filtreleri</h2>
      <div className="d-flex gap-16">
        <div className={styles.productFilters}>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.filterInput}
          />
          <FilterButtonGroup
            title="Koleksiyonlar"
            items={collections}
            activeItem={collection}
            setFunction={setCollection}
            allLabel="Tüm Koleksiyonlar"
          />
          <FilterButtonGroup
            title="Kategoriler"
            items={categories}
            activeItem={category}
            setFunction={setCategory}
            allLabel="Tüm Kategoriler"
          />
        </div>
        <div className="w-100">
          <div className="d-flex w-100">
            <span className={styles.productCount}>{products?.length > 0 ? products?.length + ' Ürün Bulundu' : 'Ürün Bulunamadı'}</span>
          </div>
          <div className="ml-16">{collectionDescription}</div>
          <div className={styles.productGrid}>
            {loading ? (
              <ProductCardSkeletonList />
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
        </div>
      </div>
    </main>
  )
}

export default ProductsPage