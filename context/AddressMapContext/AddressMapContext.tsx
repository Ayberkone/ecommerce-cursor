'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Province = { id: string | number; name: string }
type District = { id: string | number; name: string; provinceId: string | number }
type Neighbourhood = { id: string | number; name: string; districtId: string | number }

type AddressMapContextType = {
	provinceMap: Record<string, string>
	districtMap: Record<string, string>
	neighbourhoodMap: Record<string, string>
	getProvinceName: (id: string) => string
	getDistrictName: (id: string) => string
	getNeighbourhoodName: (id: string) => string
	isMapsLoading: boolean
}

const AddressMapContext = createContext<AddressMapContextType | undefined>(undefined)

const LS_KEY = "address-maps-v1"

function parseOrEmpty(key: string) {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return null
		return JSON.parse(raw)
	} catch {
		return null
	}
}

export function AddressMapProvider({ children }: { children: ReactNode }) {
	const [provinceMap, setProvinceMap] = useState<Record<string, string>>({})
	const [districtMap, setDistrictMap] = useState<Record<string, string>>({})
	const [neighbourhoodMap, setNeighbourhoodMap] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Try localStorage first
		const cached = parseOrEmpty(LS_KEY)
		if (cached && cached.provinceMap && cached.districtMap && cached.neighbourhoodMap) {
			setProvinceMap(cached.provinceMap)
			setDistrictMap(cached.districtMap)
			setNeighbourhoodMap(cached.neighbourhoodMap)
			setLoading(false)
			return
		}

		Promise.all([
			fetch("https://turkiyeapi.dev/api/v1/provinces").then(r => r.json()),
			fetch("https://turkiyeapi.dev/api/v1/districts").then(r => r.json()),
			fetch("https://turkiyeapi.dev/api/v1/neighborhoods").then(r => r.json()),
		])
			.then(([provincesRes, districtsRes, neighbourhoodsRes]) => {
				const provinceMap: Record<string, string> = {}
				for (const p of provincesRes.data || []) provinceMap[String(p.id)] = p.name

				const districtMap: Record<string, string> = {}
				for (const d of districtsRes.data || []) districtMap[String(d.id)] = d.name

				const neighbourhoodMap: Record<string, string> = {}
				for (const n of neighbourhoodsRes.data || []) neighbourhoodMap[String(n.id)] = n.name

				setProvinceMap(provinceMap)
				setDistrictMap(districtMap)
				setNeighbourhoodMap(neighbourhoodMap)

				localStorage.setItem(LS_KEY, JSON.stringify({ provinceMap, districtMap, neighbourhoodMap }))
				setLoading(false)
			})
			.catch(() => setLoading(false))
	}, [])

	// Fast lookup helpers
	function getProvinceName(id: string) {
		return provinceMap[id] || id
	}
	function getDistrictName(id: string) {
		return districtMap[id] || id
	}
	function getNeighbourhoodName(id: string) {
		return neighbourhoodMap[id] || id
	}

	return (
		<AddressMapContext.Provider value={{
			provinceMap,
			districtMap,
			neighbourhoodMap,
			getProvinceName,
			getDistrictName,
			getNeighbourhoodName,
			isMapsLoading: loading,
		}}>
			{children}
		</AddressMapContext.Provider>
	)
}

export function useAddressMap() {
	const ctx = useContext(AddressMapContext)
	if (!ctx) throw new Error("useAddressMap must be used within AddressMapProvider")
	return ctx
}