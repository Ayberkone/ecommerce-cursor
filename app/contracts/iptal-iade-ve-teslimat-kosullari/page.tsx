import IptalIadeKosul from '@/content/contracts/IptalIadeKosul'

export const metadata = {
  title: 'İptal/iade Ve Teslimat Koşulları | Farmalink',
  description: 'Farmalink İptal/iade Ve Teslimat Koşulları',
}

export default function IptalIadeKosulPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <IptalIadeKosul />
    </main>
  )
}