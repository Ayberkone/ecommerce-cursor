'use client'

import { useState } from "react"
import styles from './VideosSection.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import MediaModal, { MediaModalState } from "../MediaModal/MediaModal"

export type VideoItem = {
  id: string
  title: string
  url: string
  thumbnail: string
}


export const videos: VideoItem[] = [
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

export default function VideosSection() {
  const [modal, setModal] = useState<MediaModalState>({ open: false })

  return (
    <>
      <div className="container">
        <div className={styles.alan}>
          <div className={styles.headerRow}>
            <div className={styles.title}>Videolar</div>
            <Link href="/videolar" className={styles.allBtn}>Tümünü Göster</Link>
          </div>
          <div className={styles.videosRow}>
            {videos.map((v) => (
              <span
                key={v.id}
                onClick={() => setModal({ open: true, type: 'video', url: v.url })}
                className={styles.videoItem}
              >
                <div className={styles.thumbWrap}>
                  <Image
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    width={480}
                    height={270}
                    className={styles.thumb}
                  />
                  <span className={styles.playIcon}>
                    <Play
                      size={32}
                      color="#e11d48"
                      fill="#e11d48"
                      style={{ zIndex: 1 }}
                    />
                  </span>
                </div>
                <div className={styles.videoTitle}>{v.title}</div>
              </span>
            ))}
          </div>
        </div>
      </div>
      <MediaModal modal={modal} setModal={setModal} />
    </>
  )
}
