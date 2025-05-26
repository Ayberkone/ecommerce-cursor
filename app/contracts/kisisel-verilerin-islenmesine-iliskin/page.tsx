import KisiselVerilerinIslenmesi from '@/content/contracts/KisiselVerilerinIslenmesi'

export const metadata = {
  title: 'Kişisel Verilerin İşlenmesine İlişkin | Farmalink',
  description: 'Farmalink Kişisel Verilerin İşlenmesine İlişkin',
}

export default function KisiselVerilerinIslenmesiPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <KisiselVerilerinIslenmesi />
    </main>
  )
}