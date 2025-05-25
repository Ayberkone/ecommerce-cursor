'use client'

import React, { useEffect, useState } from "react"
import styles from "./AddressSelector.module.scss"

type Province = { id: string | number; name: string }
type District = { id: string | number; name: string }
type Neighbourhood = { id: string | number; name: string }

type AddressSelectorProps = {
	provinceId: string
	districtId: string
	neighbourhoodId: string
	onChange: (data: {
		provinceId?: string
		districtId?: string
		neighbourhoodId?: string
	}) => void
	disabled?: boolean
}

export function AddressSelector({
	provinceId,
	districtId,
	neighbourhoodId,
	onChange,
	disabled,
}: AddressSelectorProps) {
	const [provinces, setProvinces] = useState<Province[]>([])
	const [districts, setDistricts] = useState<District[]>([])
	const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([])
	const [loading, setLoading] = useState(false)

	// Fetch provinces on mount
	useEffect(() => {
		setLoading(true)
		fetch("https://turkiyeapi.dev/api/v1/provinces")
			.then(r => r.json())
			.then(res => setProvinces(res.data || []))
			.catch(() => setProvinces([]))
			.finally(() => setLoading(false))
	}, [])

	// Fetch districts when province changes
	useEffect(() => {
		if (provinceId) {
			setLoading(true)
			fetch(`https://turkiyeapi.dev/api/v1/districts?provinceId=${provinceId}`)
				.then(r => r.json())
				.then(res => setDistricts(res.data || []))
				.catch(() => setDistricts([]))
				.finally(() => setLoading(false))
		} else {
			setDistricts([])
		}
		// Reset children
		onChange({ districtId: "", neighbourhoodId: "" })
		// eslint-disable-next-line
	}, [provinceId])

	// Fetch neighbourhoods when district changes
	useEffect(() => {
		if (districtId) {
			setLoading(true)
			fetch(`https://turkiyeapi.dev/api/v1/neighborhoods?districtId=${districtId}`)
				.then(r => r.json())
				.then(res => setNeighbourhoods(res.data || []))
				.catch(() => setNeighbourhoods([]))
				.finally(() => setLoading(false))
		} else {
			setNeighbourhoods([])
		}
		onChange({ neighbourhoodId: "" })
		// eslint-disable-next-line
	}, [districtId])

	return (
		<>
			<div className={styles.formGroup}>
				<label>İl *</label>
				<select
					value={provinceId}
					onChange={e => onChange({ provinceId: e.target.value })}
					required
					disabled={disabled || loading}
				>
					<option value="">İl Seçiniz</option>
					{provinces.map(il => (
						<option value={il.id} key={il.id}>{il.name}</option>
					))}
				</select>
			</div>
			<div className={styles.formGroup}>
				<label>İlçe *</label>
				<select
					value={districtId}
					onChange={e => onChange({ districtId: e.target.value })}
					required
					disabled={disabled || !provinceId || loading}
				>
					<option value="">İlçe Seçiniz</option>
					{districts.map(ilce => (
						<option value={ilce.id} key={ilce.id}>{ilce.name}</option>
					))}
				</select>
			</div>
			<div className={styles.formGroup}>
				<label>Mahalle *</label>
				<select
					value={neighbourhoodId}
					onChange={e => onChange({ neighbourhoodId: e.target.value })}
					required
					disabled={disabled || !districtId || loading}
				>
					<option value="">Mahalle Seçiniz</option>
					{neighbourhoods.map(mh => (
						<option value={mh.id} key={mh.id}>{mh.name}</option>
					))}
				</select>
			</div>
		</>
	)
}