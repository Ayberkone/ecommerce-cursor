'use client'

import { useState } from 'react'
import Section from '@/components/Section/Section'
import MediaCard from '@/components/MediaCard/MediaCard'
import styles from './media.module.scss'
import Modal from "@/components/Modal/Modal"

const TABS = [
  { id: 'videos', label: 'Videolar' },
  { id: 'press', label: 'Basın' }
]

export type MediaVideo = {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string
}

export type MediaPress = {
  id: string
  title: string
  url: string         // direct PDF or article file
  thumbnail: string   // cover image/icon
}

const VIDEOS: MediaVideo[] = [
  {
    id: 'GqUe1b0d5f4',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    youtubeUrl: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  },
  {
    id: 'GqUe1b0d5f24',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    youtubeUrl: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  },
  {
    id: 'GqUe1b0d53f4',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    youtubeUrl: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  },
  {
    id: 'GqUe1b022d5f4',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    youtubeUrl: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  }
  // ...other videos
]

const PRESS: MediaPress[] = [
  {
    id: 'gulumseyin-cekmiyoruzzz',
    title: 'Gülümseyin Çekmiyoruz',
    url: '/app/Themes/default/assets/pdf/gulumseyin-cekmiyoruz.pdf',
    thumbnail: '/img/',
  },
  {
    id: 'gulumseyin-cekmiyoruz2222',
    title: 'Gülümseyin Çekmiyoruz',
    url: '/app/Themes/default/assets/pdf/gulumseyin-cekmiyoruz.pdf',
    thumbnail: '/img/',
  },
  {
    id: 'gulumseyin-cekmiyoruz',
    title: 'Gülümseyin Çekmiyoruz',
    url: '/app/Themes/default/assets/pdf/gulumseyin-cekmiyoruz.pdf',
    thumbnail: '/img/',
  },
  {
    id: 'gulumseyin-cekmiyoruz312',
    title: 'Gülümseyin Çekmiyoruz',
    url: '/app/Themes/default/assets/pdf/gulumseyin-cekmiyoruz.pdf',
    thumbnail: '/img/',
  },
  // ...other press items
]

type ModalState =
  | { open: false }
  | { open: true; type: 'video'; url: string }
  | { open: true; type: 'press'; url: string; title: string }

export default function MediaPage() {
  const [tab, setTab] = useState<'videos' | 'press'>('videos')
  const [modal, setModal] = useState<ModalState>({ open: false })

  return (
    <Section id="media" className={styles.section}>
      <div className={styles.tabsRow}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${tab === t.id ? styles.active : ''}`}
            onClick={() => setTab(t.id as any)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {tab === 'videos'
          ? VIDEOS.map(v => (
            <button
              key={v.id}
              className={styles.mediaCardBtn}
              onClick={() => setModal({ open: true, type: 'video', url: v.youtubeUrl })}
              type="button"
            >
              <MediaCard type="video" title={v.title} url={v.youtubeUrl} thumbnail={v.thumbnail} />
            </button>
          ))
          : PRESS.map(p => (
            <button
              key={p.id}
              className={styles.mediaCardBtn}
              onClick={() => setModal({ open: true, type: 'press', url: p.url, title: p.title })}
              type="button"
            >
              <MediaCard type="press" title={p.title} url={p.url} thumbnail={p.thumbnail} />
            </button>
          ))
        }
      </div>
      <Modal open={modal.open} onClose={() => setModal({ open: false })}>
        {modal.open && modal.type === 'video' && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '1.1rem' }}>
            <iframe
              src={modal.url.replace('watch?v=', 'embed/').replace('&t=', '?start=')}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                borderRadius: '1.1rem'
              }}
            />
          </div>
        )}
        {modal.open && modal.type === 'press' && (
          <div style={{ minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.13rem', marginBottom: 10 }}>{modal.title}</h2>
            <iframe
              src={modal.url}
              style={{ width: '100%', minHeight: 400, border: 'none', borderRadius: 8 }}
              title={modal.title}
            />
            <a href={modal.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18, color: '#e11d48', fontWeight: 600 }}>
              PDF indir / yeni sekmede aç
            </a>
          </div>
        )}
      </Modal>
    </Section>
  )
}
