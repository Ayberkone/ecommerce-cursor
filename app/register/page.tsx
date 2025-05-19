// app/register/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './RegisterPage.module.scss'
import RegularRegisterForm from './RegularRegisterForm'
import ProRegisterForm from './ProRegisterForm'

export default function RegisterPage() {
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
      <div className={styles.tabSwitcher}>
        <button
          className={activeTab === 'regular' ? styles.tabActive : ''}
          onClick={() => handleTabSwitch('regular')}
          type="button"
        >
          Kayıt Ol
        </button>
        <button
          className={activeTab === 'pro' ? styles.tabActive : ''}
          onClick={() => handleTabSwitch('pro')}
          type="button"
        >
          Sağlık Prof Başvuru
        </button>
      </div>
      {/* Render appropriate form */}
      {activeTab === 'regular' ? <RegularRegisterForm /> : <ProRegisterForm />}
    </div>
  )
}
