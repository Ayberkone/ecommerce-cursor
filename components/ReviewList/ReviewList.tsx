'use client'

import styles from './ReviewList.module.scss'
import { Star } from 'lucide-react'

type Review = {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

type Props = {
  reviews: Review[]
}

const ReviewList = ({ reviews }: Props) => {
  if (!reviews?.length) {
    return <div className={styles.empty}>No reviews yet.</div>
  }
  return (
    <div className={styles.list}>
      {reviews.map(r => (
        <div key={r.id} className={styles.review}>
          <div className={styles.header}>
            <span className={styles.user}>{r.user}</span>
            <span className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < r.rating ? styles.starActive : styles.star}
                />
              ))}
            </span>
            <span className={styles.date}>{r.date}</span>
          </div>
          <div className={styles.comment}>{r.comment}</div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
