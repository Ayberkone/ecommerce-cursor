import IptalIadeKosul from '@/content/contracts/IptalIadeKosul'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Farmalink',
  description: 'Farmalink Mesafeli Satış Sözleşmesi',
}

export default function IptalIadeKosulPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <IptalIadeKosul />
    </main>
  )
}