import './globals.scss'
import Navbar from '@/components/Navbar/Navbar'
import Providers from "@/components/Providers/Providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {/* Animate ONLY this area: */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
