import KullanimKosullari from '@/content/contracts/KullanimKosullari'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function KullanimKosullariPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <KullanimKosullari />
    </main>
  )
}