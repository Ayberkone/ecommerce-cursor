import Footer from "@/components/Footer/Footer"
import './globals.scss'
import Navbar from '@/components/Navbar/Navbar'
import Providers from "@/components/Providers/Providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
