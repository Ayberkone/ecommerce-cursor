import styles from './Loader.module.scss'

export default function Loader() {
  return (
    <div className={styles.loaderBackdrop}>
      <div className={styles.spinner}></div>
    </div>
  )
}
