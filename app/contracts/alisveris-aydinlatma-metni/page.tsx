import AlisverisAydinlatmaMetni from '@/content/contracts/AlisverisAydinlatmaMetni'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function AlisverisAydinlatmaMetniPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <AlisverisAydinlatmaMetni />
    </main>
  )
}