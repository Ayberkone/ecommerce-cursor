// components/AdminNotificationBell.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, BellRing, Circle } from 'lucide-react'
import { io } from "socket.io-client"
import { fetchNotifications, fetchUnreadNotificationCount, markNotificationRead } from "@/utils/admin/notifsApi"

export default function AdminNotificationBell() {
	const [unreadCount, setUnreadCount] = useState(0)
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const [notifications, setNotifications] = useState<any[]>([])
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	useEffect(() => {
		setIsMounted(true)
		fetchUnreadNotificationCount().then(setUnreadCount)
		fetchNotifications({ limit: 5 }).then(data => setNotifications(data.notifications || []))

		const sock = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
			withCredentials: true,
			transports: ['websocket']
		})
		sock.on("notification", () => {
			setUnreadCount(count => count + 1)
		})
		sock.on("notificationRead", () => {
			// Whenever a notification is marked read anywhere, refresh the count and list
			fetchUnreadNotificationCount().then(setUnreadCount)
			fetchNotifications({ limit: 5 }).then(data => setNotifications(data.notifications || []))
		})
		return () => {
			sock.off("notification")
			sock.off("notificationRead")
			sock.disconnect()
		}
	}, [])

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false)
			}
		}
		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		}
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [dropdownOpen])

	function handleDropdownOpen() {
		setDropdownOpen(open => !open)
	}

	return (
		<div style={{ position: isMounted ? 'fixed' : 'relative', zIndex: 999, top: 0, right: 0 }} ref={dropdownRef}>
			<button
				style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
				onClick={handleDropdownOpen}
				aria-label="Bildirimler"
			>
				{unreadCount > 0 ? <BellRing size={36} /> : <Bell size={36} />}
				{unreadCount > 0 && (
					<span style={{
						bottom: 14,
						left: 14,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'absolute',
					}} >
						<Circle className="pos-abs" fill="white" stroke="red" size={28} />
						<span className="pos-abs font-size-14 white-space-pre color-danger">{unreadCount > 99 ? 99 : unreadCount}</span>
					</span>
				)}
			</button>
			{
				dropdownOpen && (
					<div style={{
						position: "absolute", right: 0, top: "120%",
						background: "#fff",
						border: "1px solid #ddd",
						borderRadius: 8,
						boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
						minWidth: 300,
						maxWidth: 340
					}}>
						<ul style={{ margin: 0, padding: 0, listStyle: "none", maxHeight: 380, overflowY: "auto" }}>
							{notifications.length === 0
								? <li style={{ padding: 16, textAlign: "center" }}>Bildirim yok</li>
								: notifications.map(n => (
									<li key={n._id} style={{ padding: "12px 18px", borderBottom: "1px solid #f4f4f4", cursor: "pointer", background: n.read ? "#fff" : "#f9fafb" }}
										onClick={() => router.push("/admin/notifications")}>
										<div style={{ fontWeight: n.read ? 400 : 700 }}>{n.title}</div>
										<div style={{ fontSize: 12, color: "#888" }}>{n.message}</div>
										<div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{new Date(n.createdAt).toLocaleString()}</div>
									</li>
								))}
						</ul>
						<div style={{ textAlign: "center", padding: 12 }}>
							<button onClick={() => router.push("/admin/notifications")} style={{ background: "none", color: "#3267fa", border: "none", cursor: "pointer", fontSize: 14 }}>
								Tüm Bildirimler
							</button>
						</div>
					</div>
				)
			}
		</div >
	)
}