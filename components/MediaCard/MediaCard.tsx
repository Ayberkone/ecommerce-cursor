import Image from 'next/image'
import { Play } from 'lucide-react'
import styles from './MediaCard.module.scss'

type MediaCardProps =
  | { type: 'video'; title: string; thumbnail: string, id: string }
  | { type: 'press'; title: string; thumbnail: string, id: string }

export default function MediaCard({ type, title, thumbnail, id }: MediaCardProps) {
  return (
    <div className={styles.mediaCard}>
      <div className={styles.thumbWrap}>
        <Image
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={title}
          width={420}
          height={236}
          className={styles.thumb}
        />
        {type === 'video' && (
          <span className={styles.playIcon}>
            <Play
              size={32}
              color="#e11d48"
              fill="#e11d48"
              style={{ zIndex: 1 }}
            />
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
