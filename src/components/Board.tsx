import { useState } from 'react'
import './Board.css'
import { Cell } from './Cell'

type CellType = {
	id: number
	pos: number
	fill: boolean
}

export function Board({ size }: { size: number }) {
	const [cells, setCells] = useState<CellType[]>(() =>
		Array(size * size)
			.fill(null)
			.map((_, i) => ({
				id: i,
				pos: i,
				fill: i === size * size - 1 ? false : true
			}))
	)

	function handleMoveCell(id: number) {
		const emptyCell = cells.find(cell => !cell.fill)
		if (!emptyCell) return

		const cellToMove = cells.find(cell => cell.id === id)
		if (!cellToMove) return

		const isAdjacent =
			(cellToMove.pos === emptyCell.pos - 1 && emptyCell.pos % size !== 0) ||
			(cellToMove.pos === emptyCell.pos + 1 && cellToMove.pos % size !== 0) ||
			cellToMove.pos === emptyCell.pos - size ||
			cellToMove.pos === emptyCell.pos + size

		if (isAdjacent) {
			setCells(prevCells =>
				prevCells.map(cell => {
					if (cell.id === cellToMove.id) {
						return { ...cell, pos: emptyCell.pos }
					}
					if (cell.id === emptyCell.id) {
						return { ...cell, pos: cellToMove.pos }
					}
					return cell
				})
			)
		}
	}

	return (
		<div
			className="board"
			style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
		>
			{cells.map(cell => (
				<Cell
					key={cell.id}
					id={cell.id}
					cellSize={300 / size}
					imgData={{
						size: 300,
						src: '/old-map.jpg',
						pos: {
							x: -(cell.id % size) * (300 / size),
							y: -Math.floor(cell.id / size) * (300 / size)
						}
					}}
					isEmpty={!cell.fill}
					translate={{
						x: (cell.pos % size) * (300 / size),
						y: Math.floor(cell.pos / size) * (300 / size)
					}}
					onClick={handleMoveCell}
				/>
			))}
		</div>
	)
}
