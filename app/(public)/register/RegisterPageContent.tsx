// app/register/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './RegisterPage.module.scss'
import RegularRegisterForm from './RegularRegisterForm'
import ProRegisterForm from './ProRegisterForm'
import Tabs from "@/components/Tabs/Tabs"

const TABS = [
  { key: 'regular', label: 'Kayıt Ol' },
  { key: 'pro', label: 'Sağlık Prof Başvuru' },
] as const

export default function RegisterPageContent() {
  // Use Next.js hook to get query string
  const searchParams = useSearchParams()
  const router = useRouter()
  // Set default based on url
  const [activeTab, setActiveTab] = useState<'regular' | 'pro'>('regular')

  // Set tab from URL on mount or when query changes
  useEffect(() => {
    const type = searchParams.get('type')
    setActiveTab(type === 'pro' ? 'pro' : 'regular')
  }, [searchParams])

  // When user clicks, update the url as well (for copy-paste/linking)
  const handleTabSwitch = (tab: 'regular' | 'pro') => {
    setActiveTab(tab)
    router.replace(tab === 'pro' ? '?type=pro' : '/register', { scroll: false })
  }

  return (
    <div className={styles.registerWrapper}>
      {/* Switch Buttons */}
      <Tabs
        tabs={[...TABS]} // Pass a mutable copy of your tabs array
        activeTabKey={activeTab} // Pass the currently active tab key
        onTabChangeAction={(key: string) => handleTabSwitch(key as 'regular' | 'pro')} // Cast key to correct type
        ariaLabel="Kayıt türü seçimi" // Optional ARIA label for accessibility
      />
      {/* Render appropriate form */}
      {activeTab === 'regular' ? <RegularRegisterForm /> : <ProRegisterForm />}
    </div>
  )
}
