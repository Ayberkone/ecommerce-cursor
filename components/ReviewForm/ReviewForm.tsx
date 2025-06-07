import { Star } from "lucide-react"
import { useState } from "react"

export function ReviewForm({ onSubmit, initialRating = 5, initialComment = "", loading }: {
  onSubmit: (rating: number, comment: string) => void,
  initialRating?: number,
  initialComment?: string,
  loading?: boolean
}) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit(rating, comment)
      }}
      style={{ marginBottom: 16, background: "#f5f5f5", padding: 16, borderRadius: 12 }}
    >
      <div>
        <label>
          Puan:
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map(star => <option key={star} value={star}>{star} <Star size={22} /></option>)}
          </select>
          {/* <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(num => (
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
          </div> */}
        </label>
      </div>
      <div>
        <textarea
          placeholder="Yorumunuzu yazın..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          required
          style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
        />
      </div>
      <button type="submit" disabled={loading || !comment.trim()} className="btn btn-primary" style={{ marginTop: 8 }}>
        Gönder
      </button>
    </form>
  )
}