import { ReactNode } from 'react'
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar'
import styles from './MyAccountLayout.module.scss'
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/utils/authServer"

export default async function MyAccountLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromCookies()
  debugger
  if (!user) redirect("/login?next=/my-account")

  return (
    <div className={styles.container}>
      <AccountSidebar />
      <div className={styles.main}>
        {children}
      </div>
    </div>
  )
}
