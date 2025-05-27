import styles from "./CategoriesBrandsPage.module.scss"

type Props = {
	items: any[]
	type: 'category' | 'brand'
	onEdit: (item: any) => void
	onDelete: (id: string) => void
	loading: boolean
}

export default function CategoryBrandList({ items, type, onEdit, onDelete, loading }: Props) {
	if (loading) return <div>Yükleniyor...</div>
	return (
		<ul className={styles.list}>
			{items.map(item => (
				<li key={item._id} className={styles.listItem}>
					<span>{item.name}</span>
					<div>
						<button onClick={() => onEdit(item)}>Düzenle</button>
						<button onClick={() => onDelete(item._id)}>Sil</button>
					</div>
				</li>
			))}
		</ul>
	)
}