'use client'

import Image from "next/image"
import styles from './BlogDetail.module.scss'
import { usePathname } from 'next/navigation'
import blogs from '@/content/blogs'

type BlogDetailProps = {
  id: string
  title: string
  date: string // e.g. '2024-01-17'
  image: string
  content: React.ReactNode // Rendered HTML or JSX for the blog body
}

export default function BlogDetailPage() {
  // export default function BlogDetailPage({ title, date, image, content }: BlogDetailProps) {
  const {
    title, date, image, content
  } = blogs[0]

  return (
    <section className={styles.blogDetailSection}>
      <div className={styles.blogContainer}>
        <div className={styles.header}>
          <div className={styles.date}>
            Yayımlanma : <b>{date}</b>
          </div>
        </div>
        <article className={styles.blogContent}>
          <h1>{title}</h1>
          <div className={styles.blogImageWrapper}>
            <Image
              src={image}
              alt={title}
              fill
              className={styles.blogImage}
              sizes="(max-width: 600px) 100vw, 50vw"
              priority
            />
          </div>
          {content}
        </article>
      </div>
    </section>
  )
}