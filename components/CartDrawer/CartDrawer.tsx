'use client'

import { useCart } from '@/components/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { BrushCleaning, MinusCircleIcon, PlusCircleIcon, Trash } from "lucide-react"
import styles from './CartDrawer.module.scss'
import Image from 'next/legacy/image'
import { useEffect, useRef } from 'react'
import { useRouter } from "next/navigation"

type CartDrawerProps = {
	open: boolean
	onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
	const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
	const router = useRouter()
	const drawerRef = useRef<HTMLDivElement>(null)

	// ESC destekle
	useEffect(() => {
		if (!open) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [open, onClose])

	// Scroll kilidi
	useEffect(() => {
		if (open) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = ''
		return () => { document.body.style.overflow = '' }
	}, [open])

	const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

	// Checkout yönlendirmesi
	const handleCheckout = () => {
		onClose()
		router.push('/checkout')
	}

	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Arkaplan */}
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
									<BrushCleaning size={100} />
									Sepetiniz boş.
								</div>
							) : (
								<>
									<div className={styles.items}>
										{cart.items.map(item => (
											<div className={styles.item} key={item.id}>
												<div className={styles.itemImg}>
													{item.image ? (
														<Image src={item.image} alt={item.name} width={54} height={54} />
													) : (
														<div className={styles.imgPlaceholder}><span>Görsel Yok</span></div>
													)}
												</div>
												<div className={styles.itemInfo}>
													<div className={styles.itemName}>{item.name}</div>
													<div className={styles.itemPrice}>{item.price.toFixed(2)}₺</div>
													<div className={styles.qtyRow}>
														<MinusCircleIcon
															size={20}
															className={styles.qtyBtn}
															onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
															aria-label="Azalt"
															style={item.quantity === 1 ? { opacity: 0.3, pointerEvents: 'none' } : {}}
														/>
														<span className={styles.qty}>{item.quantity}</span>
														<PlusCircleIcon
															size={20}
															className={styles.qtyBtn}
															onClick={() => updateQuantity(item.id, item.quantity + 1)}
															aria-label="Artır"
														/>
													</div>
												</div>
												<Trash
													size={20}
													className={styles.removeBtn}
													onClick={() => removeFromCart(item.id)}
													aria-label="Ürünü kaldır"
												/>
											</div>
										))}
									</div>
									<div className={styles.summary}>
										<div>Toplam:</div>
										<div className={styles.totalPrice}>{totalPrice.toFixed(2)}₺</div>
									</div>
									<div className={styles.actions}>
										<button className={styles.clearBtn} onClick={clearCart}>Sepeti Temizle</button>
										<button className={styles.checkoutBtn} onClick={handleCheckout}>
											Siparişi Tamamla
										</button>
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