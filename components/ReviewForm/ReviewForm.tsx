'use client'

import styles from './ReviewForm.module.scss'
import { useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  onSubmit: (review: { user: string, rating: number, comment: string }) => void
}

const ReviewForm = ({ onSubmit }: Props) => {
  const [user, setUser] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user.trim() || !comment.trim() || rating < 1) {
      setError('Please fill all fields and select a rating.')
      return
    }
    onSubmit({ user, rating, comment })
    setUser('')
    setRating(0)
    setComment('')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Your name"
          value={user}
          onChange={e => setUser(e.target.value)}
          maxLength={24}
        />
        <div className={styles.stars}>
          {[1,2,3,4,5].map(num => (
            <button
              type="button"
              key={num}
              className={num <= rating ? styles.starActive : styles.star}
              aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
              onClick={() => setRating(num)}
              tabIndex={0}
            >
              <Star size={22} />
            </button>
          ))}
        </div>
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Write your review…"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        maxLength={250}
      />
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.button} type="submit">
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm
