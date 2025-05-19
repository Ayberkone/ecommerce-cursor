import KisiselVerilerinIslenmesi from '@/content/contracts/KisiselVerilerinIslenmesi'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function KisiselVerilerinIslenmesiPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <KisiselVerilerinIslenmesi />
    </main>
  )
}