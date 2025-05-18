import React from 'react'

type SectionProps = React.PropsWithChildren<{
  id?: string
  className?: string
  style?: React.CSSProperties
}>

export default function Section({ id, className = '', style, children }: SectionProps) {
  return (
    <section id={id} className={className} style={style}>
      <div className="container">
        {children}
      </div>
    </section>
  )
}
