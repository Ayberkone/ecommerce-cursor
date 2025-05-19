import DistanceSalesContract from '@/content/contracts/DistanceSalesContract'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <DistanceSalesContract />
    </main>
  )
}