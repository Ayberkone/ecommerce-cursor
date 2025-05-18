'use client'

import styles from './AccountSidebar.module.scss'
import { useAuth } from '@/components/AuthContext/AuthContext'
import { accountMenu } from '@/app/my-account/accountMenu'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

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
  const type = user?.type || 'regular'
  const menu = accountMenu[type]
  const pathname = usePathname()
  const router = useRouter()

  // Get the current menu key by matching path
  const activeKey = Object.entries(keyToPath).find(([, path]) => pathname?.startsWith(path))?.[0] || 'orders'

  function handleClick(key: string) {
    if (key === 'logout') {
      logout()
      router.push('/')
    }
  }

  return (
    <aside className={styles.menu}>
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
          >
            {item.label}
            <span className={styles.icon}><item.icon size={20} /></span>
          </Link>
        )
      )}
    </aside>
  )
}

export default AccountSidebar
