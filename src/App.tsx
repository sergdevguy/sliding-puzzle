import { useEffect, useState } from 'react'
import './App.css'
import { Board } from './components/Board'
import { ImageUpload } from './components/ImageUpload'

function App() {
	const [state, setState] = useState<'initial' | 'playing' | 'finished'>(
		'initial'
	)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	useEffect(() => {
		if (!selectedImage) {
			setImageUrl(null)
			return
		}

		const url = URL.createObjectURL(selectedImage)
		setImageUrl(url)

		return () => {
			URL.revokeObjectURL(url)
		}
	}, [selectedImage])

	return (
		<div className="app">
			{state === 'initial' ? (
				<>
					<h1 className="app__title">Sliding puzzle</h1>
					<div>
						<ImageUpload onImageSelect={setSelectedImage} />
					</div>
					<button
						className="app__button"
						onClick={() => {
							setState('playing')
						}}
					>
						Start
					</button>
				</>
			) : (
				<>
					<div className="app__toolbar">
						<div>Moves: 0</div>
					</div>
					<Board
						size={3}
						image={imageUrl}
					/>
				</>
			)}
		</div>
	)
}

export default App
