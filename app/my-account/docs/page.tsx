'use client'

import { useAuth } from '@/components/AuthContext/AuthContext'
import styles from './DocsPage.module.scss'
import { FileText, Image as FileImage, Download, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

type Document = {
  id: string
  title: string
  url: string
  uploadedAt: string
  type: 'pdf' | 'word' | 'excel' | 'ppt' | 'image' | 'other'
}

// Sample file list (replace with API/localStorage logic)
const sampleDocs: Document[] = [
  {
    id: '1',
    title: '2024 Bilgilendirme Broşürü',
    url: '/files/brosur2024.pdf',
    uploadedAt: '2024-05-27',
    type: 'pdf'
  },
  {
    id: '2',
    title: 'Kampanya Duyurusu',
    url: '/files/duyuru.docx',
    uploadedAt: '2024-05-22',
    type: 'word'
  },
  {
    id: '3',
    title: 'Açıklamalı Fiyat Listesi',
    url: '/files/list.xlsx',
    uploadedAt: '2024-05-12',
    type: 'excel'
  },
  {
    id: '4',
    title: 'Tanıtım Sunumu',
    url: '/files/sunum.pptx',
    uploadedAt: '2024-04-20',
    type: 'ppt'
  },
  {
    id: '5',
    title: 'Ürün Görseli',
    url: '/files/product.jpg',
    uploadedAt: '2024-04-10',
    type: 'image'
  }
]

// Map type to icon
function getIcon(type: string) {
  if (type === 'image') return <FileImage className={styles.iconImg} size={22} />
  // Color the icon based on type
  if (type === 'pdf') return <FileText className={styles.iconPdf} size={22} />
  if (type === 'word') return <FileText className={styles.iconWord} size={22} />
  if (type === 'excel') return <FileText className={styles.iconExcel} size={22} />
  if (type === 'ppt') return <FileText className={styles.iconPpt} size={22} />
  return <FileText size={22} />
}

export default function DocsPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])

  useEffect(() => {
    // Replace with API/localStorage later if needed
    setDocs(sampleDocs)
  }, [])

  if (!user || user.type !== 'doctor') {
    return <div>Bu sayfa sadece doktorlar için geçerlidir.</div>
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dökümanlar</h1>
      <div className={styles.list}>
        {docs.map(doc => (
          <div key={doc.id} className={styles.docRow}>
            <span className={styles.docIcon}>{getIcon(doc.type)}</span>
            <span className={styles.docTitle}>{doc.title}</span>
            <span className={styles.docDate}>{doc.uploadedAt}</span>
            {doc.type === 'pdf' ? (
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.openBtn} title="PDF Aç">
                <ExternalLink size={18} />
                Görüntüle
              </a>
            ) : (
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn} download title="İndir">
                <Download size={18} />
                İndir
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
