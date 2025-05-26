import VeriSorumlusu from '@/content/contracts/VeriSorumlusu'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function VeriSorumlusuPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <VeriSorumlusu />
    </main>
  )
}