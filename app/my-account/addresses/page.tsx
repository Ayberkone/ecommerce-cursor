'use client'

import { useAuth } from '@/components/AuthContext/AuthContext'
import { useState, useEffect } from 'react'
import styles from './AddressesPage.module.scss'

type Address = {
  id: string
  label: string
  address: string
  city: string
  district: string
  postalCode: string
}

export default function AddressesPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<Partial<Address>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const saved = JSON.parse(localStorage.getItem(`addresses_${user.username}`) || '[]')
    setAddresses(saved)
  }, [user])

  if (!user) return <div>Lütfen giriş yapın.</div>

  function saveAddresses(addrs: Address[]) {
    setAddresses(addrs)
    localStorage.setItem(`addresses_${user.username}`, JSON.stringify(addrs))
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.label || !form.address || !form.city || !form.district || !form.postalCode) return
    if (editingId) {
      // Update existing
      const updated = addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...form } as Address : addr
      )
      saveAddresses(updated)
      setEditingId(null)
    } else {
      // Add new
      saveAddresses([
        { ...form, id: Date.now().toString() } as Address,
        ...addresses,
      ])
    }
    setForm({})
  }

  function handleEdit(id: string) {
    const addr = addresses.find(a => a.id === id)
    if (addr) {
      setForm(addr)
      setEditingId(id)
    }
  }

  function handleDelete(id: string) {
    const updated = addresses.filter(addr => addr.id !== id)
    saveAddresses(updated)
  }

  function handleCancel() {
    setForm({})
    setEditingId(null)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Adreslerim</h1>
      <form className={styles.form} onSubmit={handleAddOrUpdate}>
        <div className={styles.row}>
          <input
            name="label"
            placeholder="Adres Başlığı (Ev, İş...)"
            value={form.label || ''}
            onChange={handleInput}
            className={styles.input}
            maxLength={20}
          />
          <input
            name="city"
            placeholder="Şehir"
            value={form.city || ''}
            onChange={handleInput}
            className={styles.input}
            maxLength={30}
          />
          <input
            name="district"
            placeholder="İlçe"
            value={form.district || ''}
            onChange={handleInput}
            className={styles.input}
            maxLength={30}
          />
        </div>
        <input
          name="address"
          placeholder="Adres"
          value={form.address || ''}
          onChange={handleInput}
          className={styles.input}
          maxLength={120}
        />
        <div className={styles.row}>
          <input
            name="postalCode"
            placeholder="Posta Kodu"
            value={form.postalCode || ''}
            onChange={handleInput}
            className={styles.input}
            maxLength={10}
          />
          <button className={styles.saveBtn} type="submit">
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>
          {editingId && (
            <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
              İptal
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {addresses.length === 0 && (
          <div className={styles.empty}>Kayıtlı adresiniz yok.</div>
        )}
        {addresses.map(addr => (
          <div className={styles.addressCard} key={addr.id}>
            <div className={styles.label}><strong>{addr.label}</strong></div>
            <div className={styles.address}>{addr.address}</div>
            <div>
              {addr.district}, {addr.city} {addr.postalCode}
            </div>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => handleEdit(addr.id)}>Düzenle</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(addr.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
