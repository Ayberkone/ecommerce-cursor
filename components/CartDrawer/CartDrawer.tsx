'use client'

import { useCart } from '@/components/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CartDrawer.module.scss'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

type CartDrawerProps = {
	open: boolean
	onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
	const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
	const drawerRef = useRef<HTMLDivElement>(null)

	// ESC support
	useEffect(() => {
		if (!open) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [open, onClose])

	// Lock scroll when open (simple version)
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => { document.body.style.overflow = '' }
	}, [open])

	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Backdrop */}
					<motion.div
						className={styles.backdrop}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.34 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.16 }}
						onClick={onClose}
					/>
					{/* Drawer */}
					<motion.aside
						className={styles.drawer}
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'tween', duration: 0.22 }}
						role="dialog"
						aria-modal="true"
						tabIndex={-1}
						ref={drawerRef}
					>
						<div>
							<button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">✕</button>
							<h2 className={styles.title}>Sepetim</h2>
							{cart.items.length === 0 ? (
								<div className={styles.empty}>
									{/* Optional illustration: put /public/img/empty-cart.svg */}
									<Image
										src="/img/empty-cart.svg"
										alt=""
										width={150}
										height={110}
										style={{ margin: '0 auto 18px', display: 'block' }}
									/>
									Sepetiniz boş.
								</div>
							) : (
								<>
									<div className={styles.items}>
										{cart.items.map(item => (
											<div className={styles.item} key={item.id}>
												<div className={styles.itemImg}>
													{item.image
														? (
															<Image
																src={item.image}
																alt={item.name}
																width={54}
																height={54}
															/>
														)
														: (
															// Optional: fallback placeholder image, or just a blank box
															<div className={styles.imgPlaceholder}>
																{/* you can use a default icon or image here if you want */}
																<span>No Image</span>
															</div>
														)
													}
												</div>
												<div className={styles.itemInfo}>
													<div className={styles.itemName}>{item.name}</div>
													<div className={styles.itemPrice}>{item.price}₺</div>
													<div className={styles.qtyRow}>
														<button
															className={styles.qtyBtn}
															onClick={() => updateQuantity(item.id, item.quantity - 1)}
															disabled={item.quantity <= 1}
															aria-label="Azalt"
														>-</button>
														<span className={styles.qty}>{item.quantity}</span>
														<button
															className={styles.qtyBtn}
															onClick={() => updateQuantity(item.id, item.quantity + 1)}
															aria-label="Artır"
														>+</button>
													</div>
												</div>
												<button
													className={styles.removeBtn}
													onClick={() => removeFromCart(item.id)}
													aria-label="Ürünü kaldır"
												>×</button>
											</div>
										))}
									</div>
									<div className={styles.summary}>
										<div>Toplam:</div>
										<div className={styles.totalPrice}>
											{cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}₺
										</div>
									</div>
									<div className={styles.actions}>
										<button className={styles.clearBtn} onClick={clearCart}>Sepeti Temizle</button>
										<button className={styles.checkoutBtn}>Siparişi Tamamla</button>
									</div>
								</>
							)}
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	)
}
