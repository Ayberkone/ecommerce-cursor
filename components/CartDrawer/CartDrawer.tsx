'use client'

import styles from './CartDrawer.module.scss'
import { useCart } from '@/components/CartContext'
import { X } from 'lucide-react'
import Image from 'next/image'

type Props = {
	open: boolean
	onClose: () => void
}

const CartDrawer = ({ open, onClose }: Props) => {
	const { items, addToCart, removeFromCart, clearCart } = useCart()
	const total = items.reduce(
		(sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0
	)

	if (!open) return null

	return (
		<>
			<div className={styles.drawerOverlay} onClick={onClose} />
			<aside className={styles.drawer}>
				<div className={styles.header}>
					<span className={styles.title}>Your Cart</span>
					<button className={styles.closeBtn} onClick={onClose}>
						<X size={28} />
					</button>
				</div>
				<div className={styles.items}>
					{items.length === 0 ? (
						<div>Your cart is empty.</div>
					) : (
						items.map(item => (
							<div className={styles.item} key={item.id}>
								<Image
									src={item?.imageUrl || '/placeholder.png'}
									alt={item?.name || '-'}
									className={styles.itemImg}
									width={300}
									height={300}
									style={{ objectFit: 'cover', borderRadius: '1rem' }}
									priority
								/>
								<div className={styles.itemInfo}>
									<div className={styles.itemName}>{item?.name || '-'}</div>
									<div className={styles.itemQtyRow}>
										<button
											className={styles.qtyBtn}
											onClick={() => removeFromCart(item.id)}
										>-</button>
										<span>{item.quantity || 1}</span>
										<button
											className={styles.qtyBtn}
											onClick={() => addToCart(item)}
										>+</button>
									</div>
								</div>
								<span className={styles.itemPrice}>
									₺{item?.price !== undefined ? (item.price * (item.quantity || 1)).toFixed(2) : '-'}
								</span>
							</div>
						))
					)}
				</div>
				<div className={styles.cartTotal}>
					<span>Total</span>
					<span>₺{total.toFixed(2)}</span>
				</div>
				<button className={styles.checkoutBtn} disabled={items.length === 0}>
					Checkout
				</button>
			</aside>
		</>
	)
}

export default CartDrawer
