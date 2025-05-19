'use client'

import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from '@/components/CartContext'
import { AuthProvider } from "@/components/AuthContext/AuthContext"
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <NextNProgress
        color="#e11d48"
        startPosition={0.3}
        stopDelayMs={180}
        height={4}
        showOnShallow={false}
      />
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </>
  )
}
