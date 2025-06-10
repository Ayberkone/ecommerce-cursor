'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import styles from './DocsPage.module.scss'
import { FileText, Image as FileImage, Download, Eye } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import Modal from '@/components/Modal/Modal'
import Image from 'next/image'
import { api } from "@/utils/api"

type Document = {
  _id: string
  title: string
  category: string
  url: string
  type: 'pdf' | 'word' | 'excel' | 'ppt' | 'image' | 'other'
  uploadedAt: string
  originalName?: string
}

const CATEGORIES = [
  "Gengigel",
  "Klinik Deneyimler",
  "Arastirmalar"
]

// Map type to icon
function getIcon(type: string) {
  if (type === 'image') return <FileImage className={styles.iconImg} size={22} />
  if (type === 'pdf') return <FileText className={styles.iconPdf} size={22} />
  if (type === 'word') return <FileText className={styles.iconWord} size={22} />
  if (type === 'excel') return <FileText className={styles.iconExcel} size={22} />
  if (type === 'ppt') return <FileText className={styles.iconPpt} size={22} />
  return <FileText size={22} />
}

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("tr-TR")
}

export default function DocsPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [category, setCategory] = useState<string>("")

  useEffect(() => {
    if (!user) return
    api<{ data: Document[], count: number }>("/api/docs", { showLoader: true })
      .then(res => setDocs(res.data))
      .catch(() => setDocs([]))
  }, [user])

  const filteredDocs = useMemo(() =>
    category ? docs.filter(d => d.category === category) : docs,
    [docs, category]
  )

  // Group by category
  const groupedDocs = useMemo(() => {
    const map: Record<string, Document[]> = {}
    if (filteredDocs.length === 0) return map
    filteredDocs.forEach(doc => {
      if (!map[doc.category]) map[doc.category] = []
      map[doc.category].push(doc)
    })
    return map
  }, [filteredDocs])

  if (!user || (user.type !== 'doctor' && user.type !== 'pharmacy' && user.type !== 'admin')) {
    return <div>Bu sayfa sadece profesyonel kullanıcılar içindir.</div>
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Dökümanlar</h1>
      <div className={styles.filterRow}>
        <span>Kategori:</span>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">Tümü</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {Object.entries(groupedDocs).length === 0 && (
        <div className={styles.noData}>Henüz döküman yok.</div>
      )}
      {Object.entries(groupedDocs).map(([cat, docs]) => (
        <div key={cat} className={styles.categoryGroup}>
          <h2 className={styles.categoryTitle}>{cat}</h2>
          <div className={styles.list}>
            {docs.map(doc => (
              <div key={doc._id} className={styles.docRow}>
                <span className={styles.docIcon}>{getIcon(doc.type)}</span>
                <span className={styles.docTitle}>{doc.title}</span>
                <span className={styles.docDate}>{formatDate(doc.uploadedAt)}</span>
                {["pdf", "image"].includes(doc.type) ? (
                  <button
                    className={styles.openBtn}
                    onClick={() => setSelectedDoc(doc)}
                    title="Görüntüle"
                  >
                    <Eye size={18} />
                    Görüntüle
                  </button>
                ) : (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadBtn}
                    download
                    title="İndir"
                  >
                    <Download size={18} />
                    İndir
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Modal for viewing PDF/image */}
      <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)}>
        {selectedDoc && (
          <>
            <h2 className="color-primary font-bold font-size-24 mb-12">{selectedDoc.title}</h2>
            {selectedDoc.type === "pdf" ? (
              <iframe
                src={selectedDoc.url}
                style={{ width: "100%", height: "80vh", border: "none" }}
                title={selectedDoc.title}
                allow="autoplay"
              />
            ) : selectedDoc.type === "image" ? (
              <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
                <Image
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div style={{ padding: 32 }}>Bu dosya tipi desteklenmiyor.</div>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}