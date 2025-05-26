'use client'

import { useEffect, useState } from 'react'
import styles from './ApprovalsPage.module.scss'
import { fetchPendingUsers, approveUser, rejectUser } from '@/utils/adminApi'
import { toast } from 'sonner'
import RejectionModal from "@/components/Admin/RejectionModal/RejectionModal"

type PendingUser = {
  _id: string
  name: string
  email: string
  phone?: string
  type: string
  createdAt: string
  [key: string]: any
}

export default function ApprovalsPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null)
  const [rejectLoading, setRejectLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  function toggleSelect(id: string) {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id])
  }

  function toggleSelectAll(users: PendingUser[]) {
    setSelected(prev => prev.length > 0 ? [] : users.map(u => u._id))
  }

  useEffect(() => {
    setLoading(true)
    fetchPendingUsers()
      .then((data) => setUsers(data))
      .catch((err) => toast.error('Onay bekleyenler alınamadı'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id: string) => {
    setActionId(id)
    try {
      await approveUser(id)
      setUsers(users.filter(u => u._id !== id))
      toast.success('Kullanıcı onaylandı!')
    } catch {
      toast.error('Onaylama başarısız!')
    } finally {
      setActionId(null)
    }
  }

  const handleRejectClick = (id: string) => {
    setPendingRejectId(id)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setPendingRejectId(null)
  }

  const handleRejectModalConfirm = async (note: string) => {
    if (!pendingRejectId) return
    setRejectLoading(true)
    try {
      await rejectUser(pendingRejectId, note)
      setUsers(users.filter(u => u._id !== pendingRejectId))
      toast.success('Kullanıcı reddedildi!')
      handleModalClose()
    } catch {
      toast.error('Reddetme başarısız!')
    } finally {
      setRejectLoading(false)
    }
  }

  // await fetch("/api/admin/bulk-approve", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ids: selectedIds, adminId }),
  // })

  // await fetch("/api/admin/bulk-reject", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ids: selectedIds, adminId, note }),
  // })

  return (
    <>
      <main className={styles.approvalsMain}>
        <h1>Onay Bekleyen Kullanıcılar</h1>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div>Onay bekleyen kullanıcı yok.</div>
        ) : (
          <table className={styles.approvalsTable}>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={() => toggleSelectAll(users)} checked={selected.length === users.length} /></th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Tip</th>
                <th>Telefon</th>
                <th>Kayıt Tarihi</th>
                <th>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
                      onChange={() => toggleSelect(user._id)}
                    />
                  </td>
                  <td data-label="Ad Soyad">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Tip">{user.type}</td>
                  <td data-label="Telefon">{user.phone || '-'}</td>
                  <td data-label="Kayıt Tarihi">{new Date(user.createdAt).toLocaleString('tr-TR')}</td>
                  <td data-label="Aksiyon">
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleApprove(user._id)}
                      disabled={actionId === user._id}
                    >Onayla</button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleRejectClick(user._id)}
                      disabled={actionId === user._id}
                    >Reddet</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <RejectionModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleRejectModalConfirm}
        loading={rejectLoading}
      />
    </>
  )
}