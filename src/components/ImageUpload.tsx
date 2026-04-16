import { useEffect, useState } from 'react'
import { cropToSquare } from '../utils'
import './ImageUpload.css'

export function ImageUpload({
	onImageSelect
}: {
	onImageSelect: (image: File) => void
}) {
	const [preview, setPreview] = useState<string | null>(null)

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const croppedFile = await cropToSquare(file)
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
			/>
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
