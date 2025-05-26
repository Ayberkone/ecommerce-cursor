import CerezAydinlatmaMetni from '@/content/contracts/CerezAydinlatmaMetni'

export const metadata = {
  title: 'Çerez Aydınlatma Metni | Farmalink',
  description: 'Farmalink Çerez Aydınlatma Metni',
}

export default function KullanimKosullariPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <CerezAydinlatmaMetni />
    </main>
  )
}