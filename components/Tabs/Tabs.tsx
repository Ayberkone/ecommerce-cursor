// components/Tabs/Tabs.tsx
'use client'

import React from 'react'
import styles from './Tabs.module.scss' // Create this SCSS file

// Define the shape of a single tab item
interface TabItem {
	key: string
	label: string
}

interface TabsProps {
	tabs: TabItem[] // Array of tab objects
	activeTabKey: string // Key of the currently active tab
	onTabChangeAction: (key: string) => void // Callback for when a tab is clicked
	ariaLabel?: string // Optional ARIA label for accessibility
}

export default function Tabs({ tabs, activeTabKey, onTabChangeAction, ariaLabel = 'Section tabs' }: TabsProps) {
	return (
		<div className={styles.tabsContainer} role="tablist" aria-label={ariaLabel}>
			{tabs.map((tab) => (
				<button
					key={tab.key}
					className={`${styles.tabButton} ${activeTabKey === tab.key ? styles.active : ''}`}
					onClick={() => onTabChangeAction(tab.key)}
					role="tab"
					aria-selected={activeTabKey === tab.key}
					id={`tab-${tab.key}`} // Unique ID for accessibility
					aria-controls={`panel-${tab.key}`} // Links to content panel (if you have one)
				>
					{tab.label}
					{activeTabKey === tab.key && <span className={styles.activeIndicator}></span>}
				</button>
			))}
		</div>
	)
}