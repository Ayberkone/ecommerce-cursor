'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import styles from './DocsPage.module.scss'
import { FileText, Image as FileImage, Download, ExternalLink, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
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

// Map type to icon
function getIcon(type: string) {
  if (type === 'image') return <FileImage className={styles.iconImg} size={22} />
  if (type === 'pdf') return <FileText className={styles.iconPdf} size={22} />
  if (type === 'word') return <FileText className={styles.iconWord} size={22} />
  if (type === 'excel') return <FileText className={styles.iconExcel} size={22} />
  if (type === 'ppt') return <FileText className={styles.iconPpt} size={22} />
  return <FileText size={22} />
}

export default function DocsPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  useEffect(() => {
    if (!user) return
    api<Document[]>("/api/docs", { showLoader: true })
      .then(setDocs)
      .catch(() => setDocs([]))
    // .finally(() => setLoading(false))
  }, [user])

  if (!user || (user.type !== 'doctor' && user.type !== 'pharmacy' && user.type !== 'admin')) {
    return <div>Bu sayfa sadece profesyonel kullanıcılar içindir.</div>
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Dökümanlar</h1>
      <div className={styles.list}>
        {docs.map(doc => (
          <div key={doc._id} className={styles.docRow}>
            <span className={styles.docIcon}>{getIcon(doc.type)}</span>
            <span className={styles.docTitle}>{doc.title}</span>
            <span className={styles.docDate}>{doc.uploadedAt ? doc.uploadedAt.slice(0, 10) : ""}</span>
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