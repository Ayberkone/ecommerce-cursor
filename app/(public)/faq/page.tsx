'use client'
import React, { useState, useMemo } from "react"
import { faqData } from "@/content/faq"
import styles from "./FAQ.module.scss"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = useMemo(() =>
    faqData.filter(
      item => item.question.toLocaleLowerCase('tr-TR').includes(query.toLowerCase())
    ), [query])

  return (
    <section className={styles.faqSection}>
      <h1 className={styles.title}>Sıkça Sorulan Sorular</h1>
      <div className={styles.searchBarWrapper}>
        <input
          type="search"
          placeholder="Soru ara..."
          value={query}
          className={styles.searchBar}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className={styles.accordion}>
        {filtered.length === 0 && (
          <div className={styles.notFound}>Sonuç bulunamadı.</div>
        )}
        {filtered.map(item => (
          <div
            key={item.id}
            className={
              styles.accordionItem +
              (openId === item.id ? " " + styles.active : "")
            }
          >
            <button
              className={styles.accordionHeader}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              aria-expanded={openId === item.id}
              aria-controls={`faq-content-${item.id}`}
              id={`faq-header-${item.id}`}
              type="button"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={styles.chevron}
                style={{
                  transform: openId === item.id ? "rotate(180deg)" : undefined,
                }}
                size={20}
                aria-hidden
              />
            </button>
            <div
              id={`faq-content-${item.id}`}
              role="region"
              aria-labelledby={`faq-header-${item.id}`}
              className={styles.accordionPanel}
              style={{
                maxHeight: openId === item.id ? "2000px" : "0px",
              }}
            >
              <div className={styles.accordionBody}>{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}