// app/admin/ApprovalsPage.tsx

'use client'

import { useEffect, useState } from 'react'
import styles from './ApprovalsPage.module.scss'

type PendingUser = {
  _id: string
  type: 'pharmacy' | 'doctor'
  email: string
  name: string
  phone?: string
  extraFields?: Record<string, any>
  createdAt: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch pending users
  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/pending-users')
      .then(res => res.json())
      .then(data => {
        setPendingUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Yüklenirken hata oluştu.')
        setLoading(false)
      })
  }, [])

  const handleApprove = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı onaylamak istiyor musunuz?')) return
    const res = await fetch(`/api/admin/approve-user/${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminId: 'ADMIN_ID' }) })
    if (res.ok) {
      setPendingUsers(pendingUsers.filter(u => u._id !== userId))
    } else {
      alert('Onay başarısız!')
    }
  }

  const handleReject = async (userId: string) => {
    const note = prompt('Reddetme notu girin (opsiyonel):')
    const res = await fetch(`/api/admin/reject-user/${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminId: 'ADMIN_ID', note }) })
    if (res.ok) {
      setPendingUsers(pendingUsers.filter(u => u._id !== userId))
    } else {
      alert('Reddetme başarısız!')
    }
  }

  if (loading) return <div>Yükleniyor…</div>
  if (error) return <div>{error}</div>

  return (
    <main className={styles.approvalsMain}>
      <h1>Bekleyen Kullanıcı Onayları</h1>
      <table className={styles.approvalsTable}>
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Tip</th>
            <th>Telefon</th>
            <th>Kayıt Tarihi</th>
            <th>Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{user.phone || '-'}</td>
              <td>{new Date(user.createdAt).toLocaleString('tr-TR')}</td>
              <td>
                <button onClick={() => handleApprove(user._id)} className={styles.approveBtn}>Onayla</button>
                <button onClick={() => handleReject(user._id)} className={styles.rejectBtn}>Reddet</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pendingUsers.length === 0 && <div>Onay bekleyen kullanıcı yok.</div>}
    </main>
  )
}