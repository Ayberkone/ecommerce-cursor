'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, UserSquare2 } from 'lucide-react'
import styles from './Navbar.module.scss'
import { useCart } from '@/components/CartContext'
import CartDrawer from '@/components/CartDrawer/CartDrawer'
import { useAuth } from "@/context/AuthContext/AuthContext"

export default function Navbar() {
  const pathname = usePathname()
  const { cart } = useCart()
  const count = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logoWrapper}>
            <Image
              src={'/img/web-logo.svg'}
              alt="Farmalink Gengigel"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </span>
        </Link>
        <div className={styles.menu}>
          <Link
            href="/products"
            className={`${styles.navLink} ${pathname.startsWith('/products') ? styles.active : ''}`}
          >
            Ürünler
          </Link>
          <Link
            href="/about-us"
            className={`${styles.navLink} ${pathname === '/about-us' ? styles.active : ''}`}
          >
            Hakkımızda
          </Link>
          <Link
            href="/offers"
            className={`${styles.navLink} ${pathname === '/offers' ? styles.active : ''}`}
          >
            Kampanyalar
          </Link>
          <Link
            href="/faq"
            className={`${styles.navLink} ${pathname === '/faq' ? styles.active : ''}`}
          >
            S.S.S.
          </Link>
          <Link
            href="/blog"
            className={`${styles.navLink} ${pathname.startsWith('/blog') ? styles.active : ''}`}
          >
            Blog
          </Link>
          <Link
            href="/media"
            className={`${styles.navLink} ${pathname === '/media' ? styles.active : ''}`}
          >Medya</Link>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cartIcon}
            onClick={() => setDrawerOpen(true)}
            aria-label="Sepeti Aç"
          >
            <ShoppingCart color="#23539B" size={24} />
            {count > 0 && (
              <span className={styles.cartBadge}>{count}</span>
            )}
          </button>
          {user ? (
            <>
              <Link
                href="/my-account"
                className={`${styles.link} ${pathname === '/orders' ? styles.active : ''}`}
              >
                <span className={`${styles.username} ${styles.desktopOnly}`}>
                  <UserSquare2 color="#23539B" size={24} />
                  {user.username}
                </span>
              </Link>
              {user.type === 'pharmacy' && (
                <Link href="/special-offers" className={`${styles.link} ${styles.desktopOnly}`}>Eczane Fırsatları</Link>
              )}
              {user.type === 'doctor' && (
                <Link href="/doctor-portal" className={`${styles.link} ${styles.desktopOnly}`}>Doktor Portalı</Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className={`${styles.login} ${styles.desktopOnly} ${pathname === '/login' ? styles.active : ''}`}>
                Giriş Yap
              </Link>
              <Link href="/register" className={`${styles.register} ${styles.desktopOnly} ${pathname === '/register' ? styles.active : ''}`}>
                Kayıt Ol
              </Link>
            </>
          )}
          {/* Hamburger always visible on mobile */}
          <button className={styles.hamburger} aria-label="Menüyü Aç" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileOpen && <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} tabIndex={-1} aria-label="Kapat"></div>}
      <aside className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ''}`} tabIndex={-1}>
        <button
          className={styles.hamburger}
          aria-label="Menüyü Kapat"
          onClick={() => setMobileOpen(false)}
          style={{ position: 'absolute', top: 12, right: 14 }}
        >
          <X color="#23539B" size={24} />
        </button>
        <div className={styles.logoWrapper} style={{ marginBottom: '2rem' }}>
          <Image src={'/img/web-logo.svg'} alt="Farmalink Gengigel" fill style={{ objectFit: 'contain' }} />
        </div>
        <nav className={styles.mobileMenuLinks}>
          <Link
            href="/products"
            className={`${styles.navLink} ${pathname.startsWith('/products') ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >Ürünler</Link>
          <Link
            href="/about-us"
            className={`${styles.navLink} ${pathname === '/about-us' ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >Hakkımızda</Link>
          <Link
            href="/offers"
            className={`${styles.navLink} ${pathname === '/offers' ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >Kampanyalar</Link>
          <Link
            href="/faq"
            className={`${styles.navLink} ${pathname === '/faq' ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >S.S.S.</Link>
          <Link
            href="/blog"
            className={`${styles.navLink} ${pathname.startsWith('/blog') ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >Blog</Link>
          <Link
            href="/media"
            className={`${styles.navLink} ${pathname === '/media' ? styles.active : ''}`}
            onClick={() => setMobileOpen(false)}
          >Medya</Link>
          {user && user.type === 'pharmacy' && (
            <Link
              href="/special-offers"
              className={`${styles.link} ${pathname === '/special-offers' ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >Eczane Fırsatları</Link>
          )}
          {user && user.type === 'doctor' && (
            <Link
              href="/doctor-portal"
              className={`${styles.link} ${pathname === '/doctor-portal' ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >Doktor Portalı</Link>
          )}
          <hr style={{ margin: '1.4rem 0', border: 'none', borderTop: '1px solid #ececec' }} />
          {user ? (
            <>
              <Link
                href="/my-account"
                className={`${styles.link} ${pathname === '/orders' ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.username}>
                  <UserSquare2 color="#23539B" size={24} />
                  {user.username}
                </span>
              </Link>
              <Link
                href="/orders"
                className={`${styles.link} ${pathname === '/orders' ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >Siparişlerim</Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${styles.login} ${pathname === '/login' ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >Giriş Yap</Link>
              <Link
                href="/register"
                className={`${styles.login} ${pathname === '/register' ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >Kayıt Ol</Link>
            </>
          )}
        </nav>
      </aside>
      {/* CART DRAWER */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}