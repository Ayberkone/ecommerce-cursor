'use client'

import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from '@/components/CartContext'
import { AuthProvider } from "@/context/AuthContext/AuthContext"
import { Toaster } from 'sonner'
import { AddressMapProvider } from "@/context/AddressMapContext/AddressMapContext"
import { LoaderProvider } from "@/context/LoaderContext/LoaderContext"
import LayoutLoader from "@/components/LayoutLoader/LayoutLoader"
import LayoutLoaderInit from "@/components/LayoutLoaderInit/LayoutLoaderInit"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <NextNProgress
        color="#000000"
        startPosition={0.3}
        stopDelayMs={180}
        height={4}
        showOnShallow={false}
      />
      <AuthProvider>
        <LoaderProvider>
          <LayoutLoader />
          <LayoutLoaderInit />
          {children}
          <CartProvider>
            <AddressMapProvider>
              {children}
            </AddressMapProvider>
          </CartProvider>
        </LoaderProvider>
      </AuthProvider>
    </>
  )
}
