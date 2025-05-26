import UyelikSozlesmesi from '@/content/contracts/UyelikSozlesmesi'

export const metadata = {
  title: 'Üyelik Sözleşmesi | Farmalink',
  description: 'Farmalink Üyelik Sözleşmesi',
}

export default function UyelikSozlesmesiPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <UyelikSozlesmesi />
    </main>
  )
}