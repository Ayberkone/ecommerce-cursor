import UyelikSozlesmesi from '@/content/contracts/UyelikSozlesmesi'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function UyelikSozlesmesiPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <UyelikSozlesmesi />
    </main>
  )
}