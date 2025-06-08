'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// ---- Types ----
export type CartItem = {
  id: string | number
  name: string
  price: number
  quantity: number
  image: string
}

type Cart = {
  items: CartItem[]
}

// ---- Defaults ----
const defaultCart: Cart = { items: [] }

type CartContextType = {
  cart: Cart
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cart: defaultCart,
  addToCart: () => { },
  removeFromCart: () => { },
  updateQuantity: () => { },
  clearCart: () => { },
})

// ---- Provider ----
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart)

  // LocalStorage keys (optional: prefix for multiple projects)
  const CART_KEY = 'cart'

  // Load cart from localStorage on mount (CSR only)
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(CART_KEY) : null
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch (e) {
        setCart(defaultCart)
      }
    }
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }
  }, [cart])

  // ---- Actions ----
  function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    setCart(prev => {
      const existing = prev.items.find(i => i.id === item.id)
      let newItems
      if (existing) {
        newItems = prev.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      } else {
        newItems = [...prev.items, { ...item, quantity }]
      }
      return { items: newItems }
    })
  }

  function removeFromCart(id: string | number) {
    setCart(prev => ({
      items: prev.items.filter(i => i.id !== id)
    }))
  }

  function updateQuantity(id: string | number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart(prev => ({
      items: prev.items.map(i =>
        i.id === id
          ? { ...i, quantity: quantity < 1 ? 1 : quantity }
          : i
      )
    }))
  }

  function clearCart() {
    setCart(defaultCart)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// ---- Hook ----
export function useCart() {
  return useContext(CartContext)
}
