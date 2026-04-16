import { useState } from 'react'
import './App.css'
import { Board } from './components/Board'

function App() {
	const [state, setState] = useState<'initial' | 'playing' | 'finished'>(
		'initial'
	)

	return (
		<div className="app">
			{state === 'initial' ? (
				<>
					<h1 className="app__title">Sliding puzzle</h1>
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
					<Board size={3} />
				</>
			)}
		</div>
	)
}

export default App
