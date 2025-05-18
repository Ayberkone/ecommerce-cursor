import { ReactNode } from 'react'
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar'
import styles from './MyAccountLayout.module.scss'

export default function MyAccountLayout({ children }: { children: ReactNode }) {
  // `active` will be determined by the current route in the sidebar
  return (
    <div className={styles.container}>
      <AccountSidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
