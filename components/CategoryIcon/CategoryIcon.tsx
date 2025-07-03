import React from "react"
import Image from "next/legacy/image"
import { Droplet, Shield, SprayCan, Syringe, Box, Bubbles } from "lucide-react"

type CategoryIconProps = {
	name: string
	selected?: boolean
	className?: string
	// Optionally accept custom iconSize, default 40
	iconSize?: number
}

// Map category names (or IDs if you prefer) to icon & background color
const categoryMap: Record<string, { icon: React.ReactNode; color: string; accent?: string }> = {
	"Jel": {
		icon: <Droplet size={40} color="#43bfa3" />,
		color: "#e0f6ed",
		accent: "#43bfa3"
	},
	"Gargara": {
		icon: <Bubbles size={40} color="#ae9bed" />,
		color: "#f2e8fd",
		accent: "#ae9bed"
	},
	"Sprey": {
		icon: <SprayCan size={40} color="#52b9fe" />,
		color: "#e6f6fd",
		accent: "#52b9fe"
	},
	"Şırınga": {
		icon: <Syringe size={40} color="#dac87d" />,
		color: "#fcfae5",
		accent: "#dac87d"
	},
	"Diş ve Diş Eti Macunu": {
		icon: <Shield size={40} color="#23539b" />,
		color: "#e8effc",
		accent: "#43d6a3"
	}
	// Add more as needed
}

export function CategoryIcon({ name, selected = false, className = "", iconSize = 40 }: CategoryIconProps) {
	const map = categoryMap[name] || {
		icon: <Box size={iconSize} color="#aaa" />,
		color: "#f4f4f7"
	}

	return (
		<span
			className={className}
			style={{
				background: map.color,
				borderRadius: 14,
				width: iconSize + 24,
				height: iconSize + 24,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				filter: selected ? 'drop-shadow(5px 5px 0px var(--gray-400))' : 'none',
				boxShadow: selected ? "0 4px 16px rgba(67,191,163,0.08)" : "0 2px 8px rgba(67,191,163,0.06)",
				transition: "border 0.2s"
			}}
		>
			{map.icon}
		</span>
	)
}