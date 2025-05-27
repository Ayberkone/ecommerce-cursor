// components/ImageUploader.tsx
'use client'
import { useRef, useState } from 'react'

type Props = {
	onUploadAction: (url: string) => void // called with the image URL
}

export default function ImageUploader({ onUploadAction }: Props) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState('')

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		setUploading(true)
		setError('')
		try {
			const data = new FormData()
			data.append('file', file)
			data.append('upload_preset', 'farmalink')
			const res = await fetch('https://api.cloudinary.com/v1_1/dvfqssaxz/image/upload', {
				method: 'POST',
				body: data,
			})
			const json = await res.json()
			if (!json.secure_url) {
				throw new Error(json.error?.message || 'Upload failed')
			}
			onUploadAction(json.secure_url)
		} catch (e: any) {
			setError(e.message || 'Yükleme hatası!')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading}
				style={{ marginBottom: 8 }}
			>
				{uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
			</button>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				style={{ display: 'none' }}
				onChange={handleFile}
				disabled={uploading}
			/>
			{error && <div style={{ color: 'red' }}>{error}</div>}
		</div>
	)
}