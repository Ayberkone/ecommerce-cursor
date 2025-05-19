'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import styles from './Navbar.module.scss'
import { useCart } from '@/components/CartContext'
import { useState } from 'react'
import CartDrawer from '@/components/CartDrawer/CartDrawer'
import { useAuth } from "@/components/AuthContext/AuthContext"

const Navbar = () => {
  const { cart } = useCart()
  const count = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.brand}>Farmalink</Link>
        <div className={styles.menu}>
          <Link href="/products" className={styles.navLink}>Products</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/offers" className={styles.navLink}>Offers</Link>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cartIcon}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart color="#23539B" size={24} />
            {count > 0 && (
              <span className={styles.cartBadge}>{count}</span>
            )}
          </button>
          {user && (
            <>
              <span className={styles.username}>
                Hi, {user.username} <span className={styles.userType}>({user.type})</span>
              </span>
              {user.type === 'pharmacy' && (
                <Link href="/special-offers" className={styles.link}>Special Offers</Link>
              )}
              {user.type === 'doctor' && (
                <Link href="/doctor-portal" className={styles.link}>Doctor Portal</Link>
              )}
              <Link href="/orders" className={styles.link}>My Orders</Link>
              <button className={styles.logout} onClick={logout}>Logout</button>
            </>
          )}
          {!user && (
            <Link href="/login" className={styles.login}>Login</Link>
          )}
        </div>
      </nav>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

export default Navbar
