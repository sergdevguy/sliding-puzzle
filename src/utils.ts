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
