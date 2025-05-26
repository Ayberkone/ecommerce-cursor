'use client'

import styles from './AccountSidebar.module.scss'
import { useAuth } from '@/context/AuthContext/AuthContext'
import { accountMenu } from '@/app/(public)/my-account/accountMenu'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'

const keyToPath: Record<string, string> = {
  orders: '/my-account/orders',
  docs: '/my-account/docs',
  addresses: '/my-account/addresses',
  profile: '/my-account/profile',
  password: '/my-account/password',
  sample: '/my-account/sample',
}

const AccountSidebar = () => {
  const { user, logout } = useAuth()
  type AccountMenuType = keyof typeof accountMenu
  const type: AccountMenuType = (user?.type as AccountMenuType) || 'regular'
  const menu = accountMenu[type]
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Find active key by matching current path
  const activeKey =
    Object.entries(keyToPath).find(([, path]) => pathname?.includes(path))?.[0] || 'orders'

  function handleClick(key: string) {
    if (key === 'logout') {
      logout()
      router.push('/')
      setDrawerOpen(false)
    } else {
      setDrawerOpen(false)
    }
  }

  // Hamburger always rendered, CSS hides on desktop
  return (
    <>
      <button
        className={styles.hamburger}
        aria-label="Hesap menüsünü aç"
        onClick={() => setDrawerOpen(x => !x)}
        type="button"
      >
        <Menu size={28} />
      </button>
      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={() => setDrawerOpen(false)}
          tabIndex={-1}
          aria-label="Menüyü kapat"
        />
      )}
      <aside className={`${styles.menu} ${drawerOpen ? styles.open : ''}`}>
        {menu.map(item =>
          item.key === 'logout' ? (
            <button
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleClick(item.key)}
              type="button"
            >
              {item.label}
              <span className={styles.icon}><item.icon size={20} /></span>
            </button>
          ) : (
            <Link
              key={item.key}
              href={keyToPath[item.key] || '#'}
              className={`${styles.menuItem} ${activeKey === item.key ? styles.active : ''}`}
              onClick={() => handleClick(item.key)}
            >
              {item.label}
              <span className={styles.icon}><item.icon size={20} /></span>
            </Link>
          )
        )}
      </aside>
    </>
  )
}

export default AccountSidebar