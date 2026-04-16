import type { CellType } from './components/Board'

export function shuffleArray(cells: CellType[], size: number): CellType[] {
	// Создаем копию массива
	const shuffled = [...cells]

	// Получаем позицию пустой ячейки
	const emptyCell = shuffled.find(cell => !cell.fill)
	if (!emptyCell) return shuffled

	// Количество перемешиваний (чем больше, тем сильнее перемешано)
	const shuffleCount = size * size * 20 // например 180 для size=3

	for (let i = 0; i < shuffleCount; i++) {
		// Находим текущую пустую ячейку
		const currentEmpty = shuffled.find(cell => !cell.fill)
		if (!currentEmpty) continue

		// Получаем соседние ячейки (которые могут двигаться)
		const neighbors = shuffled.filter(cell => {
			if (!cell.fill) return false

			const isAdjacent =
				(cell.pos === currentEmpty.pos - 1 && currentEmpty.pos % size !== 0) ||
				(cell.pos === currentEmpty.pos + 1 && cell.pos % size !== 0) ||
				cell.pos === currentEmpty.pos - size ||
				cell.pos === currentEmpty.pos + size

			return isAdjacent
		})

		if (neighbors.length === 0) continue

		// Выбираем случайного соседа
		const randomNeighbor =
			neighbors[Math.floor(Math.random() * neighbors.length)]

		// Меняем позиции
		const emptyPos = currentEmpty.pos
		const neighborPos = randomNeighbor.pos

		shuffled.forEach(cell => {
			if (cell.id === currentEmpty.id) {
				cell.pos = neighborPos
			} else if (cell.id === randomNeighbor.id) {
				cell.pos = emptyPos
			}
		})
	}

	return shuffled
}

export function cropToSquare(file: File): Promise<File> {
	return new Promise(resolve => {
		const img = new Image()
		img.src = URL.createObjectURL(file)

		img.onload = () => {
			const size = Math.min(img.width, img.height)
			const canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size

			const ctx = canvas.getContext('2d')
			const offsetX = (img.width - size) / 2
			const offsetY = (img.height - size) / 2

			ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)

			canvas.toBlob(blob => {
				const croppedFile = new File([blob!], file.name, { type: file.type })
				resolve(croppedFile)
				URL.revokeObjectURL(img.src)
			}, file.type)
		}
	})
}

export async function processImage(file: File): Promise<File> {
	return new Promise(resolve => {
		const img = new Image()
		img.src = URL.createObjectURL(file)

		img.onload = () => {
			// 1. Сначала обрезаем до квадрата
			const size = Math.min(img.width, img.height)
			const offsetX = (img.width - size) / 2
			const offsetY = (img.height - size) / 2

			// 2. Создаем canvas для обрезки
			const cropCanvas = document.createElement('canvas')
			cropCanvas.width = size
			cropCanvas.height = size

			const cropCtx = cropCanvas.getContext('2d')
			cropCtx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)

			// 3. Уменьшаем если нужно (например до 300x300)
			const targetSize = 1200
			if (size > targetSize) {
				const resizeCanvas = document.createElement('canvas')
				resizeCanvas.width = targetSize
				resizeCanvas.height = targetSize

				const resizeCtx = resizeCanvas.getContext('2d')
				resizeCtx?.drawImage(cropCanvas, 0, 0, targetSize, targetSize)

				resizeCanvas.toBlob(
					blob => {
						const processedFile = new File([blob!], file.name, {
							type: file.type
						})
						resolve(processedFile)
						URL.revokeObjectURL(img.src)
					},
					file.type,
					0.9
				)
			} else {
				cropCanvas.toBlob(
					blob => {
						const processedFile = new File([blob!], file.name, {
							type: file.type
						})
						resolve(processedFile)
						URL.revokeObjectURL(img.src)
					},
					file.type,
					0.9
				)
			}
		}
	})
}
