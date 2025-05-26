import AlisverisAydinlatmaMetni from '@/content/contracts/AlisverisAydinlatmaMetni'

export const metadata = {
  title: 'ALIŞVERİŞ AYDINLATMA METNİ | Farmalink',
  description: 'Farmalink ALIŞVERİŞ AYDINLATMA METNİ',
}

export default function AlisverisAydinlatmaMetniPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <AlisverisAydinlatmaMetni />
    </main>
  )
}