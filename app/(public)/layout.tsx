// app/(public)/layout.tsx
import { getUserFromCookies } from '@/utils/authServer'
import { redirect } from 'next/navigation'
import Footer from "@/components/Footer/Footer"
import '@/styles/globals.scss'
import Navbar from '@/components/Navbar/Navbar'
import Providers from "@/components/Providers/Providers"

export default async function PublicRootLayout({ children }: { children: React.ReactNode }) {
  // SSR: This runs on every public page
  const user = await getUserFromCookies()
  // If user is logged in as admin, redirect them to /admin
  if (user && user.type === 'admin') {
    redirect('/admin')
  }

  return (
    <html lang="tr">
      <body>
        <Providers>
          <Navbar />
          <div className="navbar-padding" />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
