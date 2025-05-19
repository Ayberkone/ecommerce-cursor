import UyelikAydinlatmaMetni from '@/content/contracts/UyelikAydinlatmaMetni'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function UyelikAydinlatmaPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <UyelikAydinlatmaMetni />
    </main>
  )
}