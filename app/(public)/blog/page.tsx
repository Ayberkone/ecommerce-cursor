'use client'

import blogs from '@/content/blogs'
import styles from './BlogList.module.scss'
import Link from 'next/link'
import Image from 'next/legacy/image'

export default function BlogListPage() {
  return (
    <section className={styles.blogsSection}>
      <div className="container">
        <h1 className={styles.pageTitle}>BLOG</h1>
        <div className={styles.blogGrid}>
          {blogs.map(blog => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className={styles.blogItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className={styles.blogImage}
                  sizes="(max-width: 600px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className={styles.blogContent}>
                <div className={styles.date}>Yayımlanma : <b>{blog.date}</b></div>
                <div className={styles.title}>{blog.title}</div>
                <div className={styles.desc}>{blog.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}