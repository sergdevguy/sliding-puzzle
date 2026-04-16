import './Cell.css'

export function Cell({
	id,
	cellSize,
	imgData,
	isEmpty,
	translate,
	onClick
}: {
	id: number
	cellSize: number
	imgData: {
		size: number
		src: File | string
		pos: { x: number; y: number }
	}
	isEmpty: boolean
	translate: { x: number; y: number }
	onClick: (id: number) => void
}) {
	return (
		<>
			{!isEmpty ? (
				<div
					className="cell"
					style={{
						backgroundImage: `url(${imgData.src})`,
						backgroundSize: `${imgData.size}px ${imgData.size}px`,
						backgroundPosition: `${imgData.pos.x}px ${imgData.pos.y}px`,
						width: cellSize,
						height: cellSize,
						transform: `translate(${translate.x}px, ${translate.y}px)`
					}}
					onClick={() => onClick(id)}
				></div>
			) : (
				<div></div>
			)}
		</>
	)
}
