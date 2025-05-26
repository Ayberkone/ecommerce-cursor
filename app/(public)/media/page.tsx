'use client'

import { useState } from 'react'
import Section from '@/components/Section/Section'
import MediaCard from '@/components/MediaCard/MediaCard'
import styles from './media.module.scss'
import MediaModal, { MediaModalState, MediaType } from "@/components/MediaModal/MediaModal"

const TABS = [
  { id: 'videos', label: 'Videolar' },
  { id: 'press', label: 'Basın' }
]

const VIDEOS: MediaType[] = [
  {
    id: 'GqUe1b0d5f4',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    url: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  },
  {
    id: 'dSavKI5kHpo',
    title: 'Sık Sorulan Sorular',
    url: 'https://www.youtube.com/watch?v=dSavKI5kHpo&t=7s',
    thumbnail: '/img/',
  },
  {
    id: 'qsUhsz_lmU0',
    title: 'Türk Periodontoloji Derneği 53. Bilimsel Kongresi',
    url: 'https://www.youtube.com/watch?v=qsUhsz_lmU0&t=2s',
    thumbnail: '/img/',
  },
  {
    id: 'w8r2jBwERLU',
    title: 'Farmalink Tanıtım Videosu',
    url: 'https://www.youtube.com/watch?v=w8r2jBwERLU',
    thumbnail: '/img/',
  }
]

const PRESS: MediaType[] = [
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

export default function MediaPage() {
  const [tab, setTab] = useState<'videos' | 'press'>('videos')
  const [modal, setModal] = useState<MediaModalState>({ open: false })

  return (
    <>
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
                onClick={() => setModal({ open: true, type: 'video', url: v.url })}
                type="button"
              >
                <MediaCard type="video" title={v.title} thumbnail={v.thumbnail} id={v.id} />
              </button>
            ))
            : PRESS.map(p => (
              <button
                key={p.id}
                className={styles.mediaCardBtn}
                onClick={() => setModal({ open: true, type: 'press', url: p.url, title: p.title })}
                type="button"
              >
                <MediaCard type="press" title={p.title} thumbnail={p.thumbnail} id={p.id} />
              </button>
            ))
          }
        </div>
      </Section>
      <MediaModal modal={modal} setModal={setModal} />
    </>
  )
}
