import { useEffect, useState } from 'react'
import { processImage } from '../utils'
import './ImageUpload.css'

export function ImageUpload({
	onImageSelect
}: {
	onImageSelect: (image: File) => void
}) {
	const [preview, setPreview] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (
				!file.type.includes('png') &&
				!file.type.includes('jpg') &&
				!file.type.includes('jpeg')
			) {
				setError('Please select a valid image file (PNG, JPG, JPEG)')
				return
			} else {
				setError(null)
			}

			const croppedFile = await processImage(file)
			onImageSelect(croppedFile)
			setPreview(URL.createObjectURL(croppedFile))
		}
	}

	useEffect(() => {
		// Clean up the object URL when the component unmounts or when a new image is selected
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview)
			}
		}
	}, [preview])

	return (
		<div className="image-upload">
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				name="file"
				id="image-upload__file"
				className="image-upload__file"
			/>
			<label
				htmlFor="image-upload__file"
				className="image-upload__file-button"
			>
				<span className="image-upload__file-button-text">
					Upload your image
				</span>
			</label>
			{error && <div className="image-upload__error">{error}</div>}
			{preview && (
				<img
					src={preview}
					alt="Preview"
					style={{ width: '200px' }}
				/>
			)}
		</div>
	)
}
