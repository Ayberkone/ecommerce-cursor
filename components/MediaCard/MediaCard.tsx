import Image from 'next/image'
import styles from './MediaCard.module.scss'

type MediaCardProps =
  | { type: 'video'; title: string; thumbnail: string }
  | { type: 'press'; title: string; thumbnail: string }

export default function MediaCard({ type, title, thumbnail }: MediaCardProps) {
  return (
    <div className={styles.mediaCard}>
      <div className={styles.thumbWrap}>
        <Image
          src={thumbnail}
          alt={title}
          width={420}
          height={236}
          className={styles.thumb}
        />
        {type === 'video' && (
          <span className={styles.playIcon}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="19" fill="#fff" opacity="0.9" />
              <polygon points="16,12 28,19 16,26" fill="#e11d48" />
            </svg>
          </span>
        )}
      </div>
      <div className={styles.mediaTitle}>{title}</div>
      <div className={styles.mediaFooter}>
        {type === 'video'
          ? <span className={styles.badge}>YouTube</span>
          : <span className={styles.badge}>PDF</span>
        }
      </div>
    </div>
  )
}
