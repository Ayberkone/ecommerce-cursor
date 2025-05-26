import UyelikAydinlatmaMetni from "@/content/contracts/UyelikAydinlatmaMetni"

export const metadata = {
  title: 'Üyelik Aydınlatma Metni | Farmalink',
  description: 'Farmalink Üyelik Aydınlatma Metni',
}

export default function UyelikAydinlatmaMetniPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <UyelikAydinlatmaMetni />
    </main>
  )
}