// FilterButtonGroup.tsx
import styles from './ProductsPage.module.scss'

interface Item {
	_id: string
	name: string
}

interface FilterButtonGroupProps {
	title: string
	items: Item[]
	activeItem: string
	setFunction: (id: string) => void
	allLabel: string // e.g., "Tüm Koleksiyonlar"
}

const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({
	title,
	items,
	activeItem,
	setFunction,
	allLabel,
}) => {
	return (
		<div className={styles.filterButtons}>
			<span className={styles.filterTitle}>{title}</span>
			<span
				onClick={() => setFunction('')}
				className={`${styles.filterButton} ${activeItem === '' ? styles.active : ''}`}
			>
				{allLabel}
			</span>
			{items.map(item => (
				<span
					key={item?._id}
					onClick={() => setFunction(item._id)}
					className={`${styles.filterButton} ${activeItem === item._id ? styles.active : ''}`}
				>
					{item?.name}
				</span>
			))}
		</div>
	)
}

export default FilterButtonGroup