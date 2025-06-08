import styles from './ProductCard.module.scss'

const ProductCardSkeleton = () => {
	return (
		<div className={styles.card}>
			<div className={styles.image}>
				<div style={{ width: 120, height: 120, backgroundColor: '#e0e0e0', borderRadius: '0.75rem' }} />
			</div>
			<div className={styles.title} style={{ width: '80%', height: '1.2em', backgroundColor: '#e0e0e0', marginBottom: '0.5em', borderRadius: '0.25rem' }} />
			<div className={styles.price} style={{ width: '40%', height: '1em', backgroundColor: '#e0e0e0', borderRadius: '0.25rem' }} />
			<div
				className={styles.button}
				style={{ backgroundColor: '#e0e0e0', color: '#e0e0e0', cursor: 'default', height: '2.5em', borderRadius: '0.25rem' }}
			>
				&nbsp;
			</div>
		</div>
	)
}

const ProductCardSkeletonList = () => {
	return (
		<>
			{Array.from({ length: 3 }).map((_, index) => (
				<ProductCardSkeleton key={index} />
			))}
		</>
	)
}

export { ProductCardSkeleton, ProductCardSkeletonList }