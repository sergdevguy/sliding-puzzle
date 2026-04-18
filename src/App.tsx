import JSConfetti from 'js-confetti'
import { useEffect, useState } from 'react'
import './App.css'
import { Board } from './components/Board'
import { ImageUpload } from './components/ImageUpload'

export type SizeType = {
	cells: number
	pixels: number
}

const defaultImages = [
	{
		src: '/images/old-map.jpg',
		alt: 'old map',
		selected: false
	},
	{
		src: '/images/fairytale.jpg',
		alt: 'fairytale',
		selected: false
	},
	{
		src: '/images/german-cathedral.jpg',
		alt: 'German Cathedral',
		selected: false
	}
]

const defaultSizes = [
	{
		cells: 2,
		pixels: 300
	},
	{
		cells: 3,
		pixels: 300
	},
	{
		cells: 4,
		pixels: 300
	},
	{
		cells: 5,
		pixels: 300
	}
]

const jsConfetti = new JSConfetti()

function App() {
	const [state, setState] = useState<'initial' | 'playing' | 'finished'>(
		'initial'
	)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	const [moves, setMoves] = useState(0)
	const [size, setSize] = useState<SizeType | null>(null)
	const [showImage, setShowImage] = useState(false)

	function handleWin() {
		setTimeout(() => {
			jsConfetti.addConfetti({
				confettiNumber: 130,
				emojis: ['🤍'],
				emojiSize: 40
			})

			setTimeout(() => {
				setState('finished')
			}, 300)
		}, 600)
	}

	function handleRestartGame() {
		setState('initial')
		setSelectedImage(null)
		setImageUrl(null)
		setMoves(0)
		setSize(null)
	}

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
					<div className="app__choose-image">
						<ImageUpload onImageSelect={setSelectedImage} />
						{!selectedImage && (
							<>
								<div>or select some of this</div>
								<div className="app__choose-image_images">
									{defaultImages.map(image => (
										<img
											key={image.src}
											src={image.src}
											alt={image.alt}
											style={{
												borderColor:
													imageUrl === image.src ? '#000' : 'transparent'
											}}
											onClick={() => setImageUrl(image.src)}
										/>
									))}
								</div>
							</>
						)}

						{imageUrl && (
							<div className="app__choose-sizes">
								<div>Select size:</div>
								{defaultSizes.map(s => (
									<button
										key={s.cells}
										className="app__choose-sizes_button"
										style={{
											borderColor:
												size?.cells === s.cells ? '#000' : 'transparent'
										}}
										onClick={() => setSize(s)}
									>
										{s.cells}x{s.cells}
									</button>
								))}
							</div>
						)}
					</div>
					{size && (
						<button
							className="app__button"
							onClick={() => {
								setState('playing')
							}}
						>
							Start
						</button>
					)}
				</>
			) : state === 'playing' ? (
				<div className="app__game">
					<div className="app__toolbar">
						<div>Moves: {moves}</div>
						<button onClick={() => setShowImage(!showImage)}>
							Watch image
						</button>
					</div>
					{showImage && imageUrl && (
						<img
							width={300}
							src={imageUrl}
							alt="preview"
							className="app__preview"
						/>
					)}
					<Board
						size={size!}
						image={imageUrl}
						onMove={() => setMoves(moves + 1)}
						onWin={handleWin}
					/>
				</div>
			) : (
				<div className="app__finished">
					<div className="app__finished-content">
						<h2>Congratulations!</h2>
						<p>You solved the puzzle in {moves} moves.</p>
					</div>
					{imageUrl && (
						<img
							src={imageUrl}
							alt="Puzzle"
							width={300}
						/>
					)}
					<button
						className="app__finished-button"
						onClick={handleRestartGame}
					>
						Back to menu
					</button>
				</div>
			)}
		</div>
	)
}

export default App
