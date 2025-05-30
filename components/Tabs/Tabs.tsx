// components/Tabs/Tabs.tsx
'use client'

import React, { CSSProperties } from 'react'
import styles from './Tabs.module.scss'

interface TabItem {
	key: string
	label: string
}

interface TabsProps {
	tabs: TabItem[]
	activeTabKey: string
	onTabChangeAction: (key: string) => void
	ariaLabel?: string
	buttonStyle?: CSSProperties // Add this prop
	activeButtonStyle?: CSSProperties // Optional: style for active tab
}

export default function Tabs({
	tabs,
	activeTabKey,
	onTabChangeAction,
	ariaLabel = 'Section tabs',
	buttonStyle,
	activeButtonStyle,
}: TabsProps) {
	return (
		<div className={styles.tabsContainer} role="tablist" aria-label={ariaLabel}>
			{tabs.map((tab) => {
				const isActive = activeTabKey === tab.key
				return (
					<button
						key={tab.key}
						className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
						onClick={() => onTabChangeAction(tab.key)}
						role="tab"
						aria-selected={isActive}
						id={`tab-${tab.key}`}
						aria-controls={`panel-${tab.key}`}
						style={{
							...buttonStyle,
							...(isActive ? activeButtonStyle : {}),
						}}
					>
						{tab.label}
						<span className={styles.activeIndicator}></span>
					</button>
				)
			})}
		</div>
	)
}