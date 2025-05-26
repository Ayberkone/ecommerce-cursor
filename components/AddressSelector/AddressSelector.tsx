'use client'

import React, { useEffect, useState, useRef } from "react"
import styles from "./AddressSelector.module.scss"

type Province = { id: string | number; name: string }
type District = { id: string | number; name: string }
type Neighbourhood = { id: string | number; name: string }

type AddressSelectorProps = {
	provinceId: string
	districtId: string
	neighbourhoodId: string
	onChangeAction: (data: {
		provinceId?: string
		provinceName?: string
		districtId?: string
		districtName?: string
		neighbourhoodId?: string
		neighbourhoodName?: string
	}) => void
	disabled?: boolean
}

export function AddressSelector({
	provinceId,
	districtId,
	neighbourhoodId,
	onChangeAction,
	disabled
}: AddressSelectorProps) {
	const [provinces, setProvinces] = useState<Province[]>([])
	const [districts, setDistricts] = useState<District[]>([])
	const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([])
	const [loadingProvinces, setLoadingProvinces] = useState(false)
	const [loadingDistricts, setLoadingDistricts] = useState(false)
	const [loadingNeighbourhoods, setLoadingNeighbourhoods] = useState(false)

	// Track if initial load to avoid unwanted resets on mount
	const initialLoad = useRef({ province: true, district: true })

	// Fetch provinces on mount
	useEffect(() => {
		setLoadingProvinces(true)
		fetch("https://turkiyeapi.dev/api/v1/provinces")
			.then(r => r.json())
			.then(res => setProvinces(res.data || []))
			.catch(() => setProvinces([]))
			.finally(() => setLoadingProvinces(false))
	}, [])

	// Fetch districts if provinceId is set
	useEffect(() => {
		if (!provinceId) {
			setDistricts([])
			setNeighbourhoods([])
			// Only reset children if NOT initial load
			if (!initialLoad.current.province) {
				onChangeAction({ districtId: "", neighbourhoodId: "" })
			}
			initialLoad.current.province = false
			return
		}
		setLoadingDistricts(true)
		fetch(`https://turkiyeapi.dev/api/v1/districts?provinceId=${provinceId}`)
			.then(r => r.json())
			.then(res => setDistricts(res.data || []))
			.catch(() => setDistricts([]))
			.finally(() => setLoadingDistricts(false))
		// Only reset children if NOT initial load
		if (!initialLoad.current.province) {
			onChangeAction({ districtId: "", neighbourhoodId: "" })
		}
		initialLoad.current.province = false
		// eslint-disable-next-line
	}, [provinceId])

	// Fetch neighbourhoods if districtId is set
	useEffect(() => {
		if (!districtId) {
			setNeighbourhoods([])
			// Only reset if NOT initial load
			if (!initialLoad.current.district) {
				onChangeAction({ neighbourhoodId: "" })
			}
			initialLoad.current.district = false
			return
		}
		setLoadingNeighbourhoods(true)
		fetch(`https://turkiyeapi.dev/api/v1/neighborhoods?districtId=${districtId}`)
			.then(r => r.json())
			.then(res => setNeighbourhoods(res.data || []))
			.catch(() => setNeighbourhoods([]))
			.finally(() => setLoadingNeighbourhoods(false))
		// Only reset if NOT initial load
		if (!initialLoad.current.district) {
			onChangeAction({ neighbourhoodId: "" })
		}
		initialLoad.current.district = false
		// eslint-disable-next-line
	}, [districtId])

	return (
		<>
			<div className={styles.formGroup}>
				<label>İl *</label>
				<select
					value={provinceId}
					onChange={e => {
						onChangeAction({ provinceId: e.target.value, provinceName: e.target.options[e.target.selectedIndex].text })
						// On user change, always reset children
						if (e.target.value !== provinceId) {
							onChangeAction({ districtId: "", neighbourhoodId: "" })
						}
					}}
					required
					disabled={disabled || loadingProvinces}
				>
					{loadingProvinces && <option value="">Yükleniyor...</option>}
					<option value="">İl Seçiniz</option>
					{!loadingProvinces && provinces.map(il => (
						<option value={il.id} key={il.id}>{il.name}</option>
					))}
				</select>
			</div>
			<div className={styles.formGroup}>
				<label>İlçe *</label>
				<select
					value={districtId}
					onChange={e => {
						onChangeAction({
							districtId: e.target.value,
							districtName: e.target.options[e.target.selectedIndex].text,
						})
						// On user change, always reset child
						if (e.target.value !== districtId) {
							onChangeAction({ neighbourhoodId: "" })
						}
					}}
					required
					disabled={disabled || !provinceId || loadingDistricts}
				>
					{loadingDistricts && <option value="">Yükleniyor...</option>}
					<option value="">İlçe Seçiniz</option>
					{!loadingDistricts && districts.map(ilce => (
						<option value={ilce.id} key={ilce.id}>{ilce.name}</option>
					))}
				</select>
			</div>
			<div className={styles.formGroup}>
				<label>Mahalle *</label>
				<select
					value={neighbourhoodId}
					onChange={e => onChangeAction({ neighbourhoodId: e.target.value, neighbourhoodName: e.target.options[e.target.selectedIndex].text })}
					required
					disabled={disabled || !districtId || loadingNeighbourhoods}
				>
					{loadingNeighbourhoods && <option value="">Yükleniyor...</option>}
					<option value="">Mahalle Seçiniz</option>
					{!loadingNeighbourhoods && neighbourhoods.map(mh => (
						<option value={mh.id} key={mh.id}>{mh.name}</option>
					))}
				</select>
			</div>
		</>
	)
}