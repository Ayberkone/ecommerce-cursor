'use client'

import { useEffect, useState } from "react"
import styles from "./AddressesPage.module.scss"
import { getAddresses, addAddress, updateAddress, deleteAddress, Address } from "@/utils/addressApi"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Star } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import AddressForm, { AddressFormValues } from "@/components/AddressForm/AddressForm"
import { useAddressMap } from "@/context/AddressMapContext/AddressMapContext"

export default function AddressesPage() {
  const { getProvinceName, getDistrictName, getNeighbourhoodName, isMapsLoading } = useAddressMap()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AddressFormValues>>({})

  // Fetch addresses
  useEffect(() => {
    setLoading(true)
    getAddresses()
      .then(setAddresses)
      .catch(() => toast.error("Adresler alınamadı"))
      .finally(() => setLoading(false))
  }, [])

  // Add or Edit address
  const handleFormSubmit = async (data: AddressFormValues) => {
    setSaving(true)
    try {
      if (editId) {
        const updated = await updateAddress(editId, data)
        setAddresses(addrs => addrs.map(a => a._id === editId ? updated : a))
        toast.success("Adres güncellendi!")
      } else {
        const newAddr = await addAddress(data)
        setAddresses(addrs => [newAddr, ...addrs])
        toast.success("Adres eklendi!")
      }
      setAddMode(false)
      setEditId(null)
      setEditForm({})
    } catch {
      toast.error("İşlem başarısız.")
    } finally {
      setSaving(false)
    }
  }

  // Delete address
  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!window.confirm("Adres silinsin mi?")) return
    setSaving(true)
    try {
      await deleteAddress(id)
      setAddresses(addrs => addrs.filter(a => a._id !== id))
      toast.success("Adres silindi!")
    } catch {
      toast.error("Adres silinemedi.")
    } finally {
      setSaving(false)
    }
  }

  // Edit address
  const handleEdit = (addr: Address) => {
    setEditId(addr._id!)
    setEditForm(addr)
    setAddMode(false)
  }

  // Set as default
  const handleSetDefault = async (id?: string) => {
    if (!id) return
    setSaving(true)
    try {
      await updateAddress(id, { isDefault: true })
      setAddresses(addrs =>
        addrs.map(a => ({ ...a, isDefault: a._id === id }))
      )
      toast.success("Varsayılan adres seçildi.")
    } catch {
      toast.error("İşlem başarısız.")
    } finally {
      setSaving(false)
    }
  }

  // Animations for cards
  const cardVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24, scale: 0.98 },
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Adreslerim</h1>
        {!addMode && !editId && (
          <button className={styles.addBtn} onClick={() => setAddMode(true)} disabled={saving}>
            <Plus size={22} /> Yeni Adres Ekle
          </button>
        )}
      </div>
      <div className={styles.addressesWrap}>
        <AnimatePresence>
          {/* Add/Edit Address Form */}
          {(addMode || editId) && (
            <motion.div
              key={editId ? `edit-${editId}` : "add-form"}
              className={styles.addressCard}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              style={{ border: "2px dashed #99bbee" }}
            >
              <AddressForm
                defaultValues={editId ? editForm : {}}
                onSubmitAction={handleFormSubmit}
                onCancelAction={() => { setAddMode(false); setEditId(null); setEditForm({}) }}
                loading={saving}
              />
            </motion.div>
          )}
          {/* Address Cards */}
          {addresses.map(addr =>
            <motion.div
              className={styles.addressCard}
              key={addr._id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              style={addr.isDefault ? { borderColor: "#43bfa3" } : {}}
            >
              <div className={styles.addressTitle}>
                {addr.title}
                {addr.isDefault && <span className={styles.defaultStar}><Star size={17} color="#43bfa3" /> Varsayılan</span>}
              </div>
              <div><b>Alıcı:</b> {addr.recipient} &nbsp; <b>Tel:</b> {addr.phone}</div>
              <div><b>Adres:</b> {addr.address}</div>
              <div><b></b> {addr.provinceName} / {addr.districtName} / {addr.neighbourhoodName} {addr.postalCode ? `/ ${addr.postalCode}` : ""}</div>
              {addr.tc && <div><b>TC:</b> {addr.tc}</div>}
              {addr.taxNumber && <div><b>Vergi No:</b> {addr.taxNumber} / {addr.taxOffice}</div>}
              <div className={styles.addressActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(addr)} disabled={saving}><Edit2 size={18} /> Düzenle</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(addr._id)} disabled={saving}><Trash2 size={18} /> Sil</button>
                {!addr.isDefault && (
                  <button className={styles.addBtn} onClick={() => handleSetDefault(addr._id)} disabled={saving}><Star size={17} /> Varsayılan Yap</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {loading && <div className={styles.infoText}>Yükleniyor...</div>}
        {!addMode && !loading && addresses.length === 0 && <div className={styles.infoText}>Kayıtlı adres bulunamadı.</div>}
      </div>
    </>
  )
}