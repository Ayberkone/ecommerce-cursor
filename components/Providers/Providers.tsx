'use client'

import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from '@/components/CartContext'
import { AuthProvider } from "@/components/AuthContext/AuthContext"
import PageTransition from "@/components/PageTransition/PageTransition"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextNProgress
        color="#e11d48"
        startPosition={0.3}
        stopDelayMs={180}
        height={4}
        showOnShallow={false}
      />
      <AuthProvider>
        <CartProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </CartProvider>
      </AuthProvider>
    </>
  )
}
