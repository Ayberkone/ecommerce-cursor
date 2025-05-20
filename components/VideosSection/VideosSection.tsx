'use client'

import styles from './VideosSection.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export type VideoItem = {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string
}

type VideosSectionProps = {
  isMediaView?: boolean
}

const videos: VideoItem[] = [
  {
    id: 'GqUe1b0d5f4',
    title: 'Hangi Gengigel Ürününü Kullanmalıyım?',
    youtubeUrl: 'https://www.youtube.com/watch?v=GqUe1b0d5f4&t=4s',
    thumbnail: '/img/',
  },
  {
    id: 'dSavKI5kHpo',
    title: 'Sık Sorulan Sorular',
    youtubeUrl: 'https://www.youtube.com/watch?v=dSavKI5kHpo&t=7s',
    thumbnail: '/img/',
  },
  {
    id: 'qsUhsz_lmU0',
    title: 'Türk Periodontoloji Derneği 53. Bilimsel Kongresi',
    youtubeUrl: 'https://www.youtube.com/watch?v=qsUhsz_lmU0&t=2s',
    thumbnail: '/img/',
  },
  {
    id: 'w8r2jBwERLU',
    title: 'Farmalink Tanıtım Videosu',
    youtubeUrl: 'https://www.youtube.com/watch?v=w8r2jBwERLU',
    thumbnail: '/img/',
  }
]

export default function VideosSection({ isMediaView }: VideosSectionProps) {
  return (
    <section id="videolar" className={styles.section}>
      <div className="container">
        <div className={styles.alan}>
          {!isMediaView && (
            <div className={styles.headerRow}>
              <div className={styles.title}>Videolar</div>
              <Link href="/videolar" className={styles.allBtn}>Tümünü Göster</Link>
            </div>
          )}
          <div className={styles.videosRow}>
            {videos.map((v) => (
              <a
                key={v.id}
                href={v.youtubeUrl}
                className={styles.videoItem}
                target="_blank"
                rel="noopener noreferrer"
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
                    <svg width="38" height="38" viewBox="0 0 38 38">
                      <circle cx="19" cy="19" r="19" fill="#fff" opacity="0.9" />
                      <polygon points="16,12 28,19 16,26" fill="#e11d48" />
                    </svg>
                  </span>
                </div>
                <div className={styles.videoTitle}>{v.title}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
