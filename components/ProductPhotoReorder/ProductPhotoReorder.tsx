'use client'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Image from "next/legacy/image"
import styles from './ProductPhotoReorder.module.scss'

type Props = {
	photos: string[]
	onChange: (photos: string[]) => void
	removePhoto: (photo: string) => void
}

export default function ProductPhotoReorder({ photos, onChange, removePhoto }: Props) {
	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return
		const reordered = Array.from(photos)
		const [moved] = reordered.splice(result.source.index, 1)
		reordered.splice(result.destination.index, 0, moved)
		onChange(reordered)
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="photos" direction="horizontal">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className={styles.photoList}>
						{photos.map((url, idx) => (
							<Draggable key={url} draggableId={url} index={idx}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										className={`${styles.photoItem} ${snapshot.isDragging ? styles.dragging : ''}`}
									>
										<Image src={url} width={90} height={90} alt="Ürün fotoğrafı" />
										<span className={styles.orderBadge}>{idx + 1}</span>
										<button type="button" onClick={() => removePhoto(url)} className={styles.removeImageBtn}>✕</button>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}