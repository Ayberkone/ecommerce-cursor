import KullanimKosullari from '@/content/contracts/KullanimKosullari'

export const metadata = {
  title: 'Kullanım Koşulları| Farmalink',
  description: 'Farmalink Kullanım Koşulları',
}

export default function KullanimKosullariPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <KullanimKosullari />
    </main>
  )
}