"use client"
import { createContext, useContext, useState } from "react"

type LoaderContextType = {
	show: () => void
	hide: () => void
	visible: boolean
}

const LoaderContext = createContext<LoaderContextType>({
	show: () => { },
	hide: () => { },
	visible: false
})

export function LoaderProvider({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false)
	const show = () => setVisible(true)
	const hide = () => setVisible(false)

	return (
		<LoaderContext.Provider value={{ show, hide, visible }}>
			{children}
		</LoaderContext.Provider>
	)
}

export function useLoader() {
	return useContext(LoaderContext)
}