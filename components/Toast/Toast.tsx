'use client'

import { useEffect } from 'react'
import styles from './Toast.module.scss'

type Props = {
  message: string
  onClose: () => void
}

const Toast = ({ message, onClose }: Props) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 2000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return <div className={styles.toast}>{message}</div>
}

export default Toast
