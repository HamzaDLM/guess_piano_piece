export type PianoPiece = {
	composer: string
	piece: string
	link: string
}

export type ReactiveData = {
	counter: number
	pieces: PianoPiece[]
	fourPieces: PianoPiece[]
	currentPiece: PianoPiece
	game_count: number
	win_count: number
	started: boolean
	playing: boolean
	answered: boolean
	answerStatus: 'correct' | 'incorrect' | null
	answerSelectedIndex: number | null
}

