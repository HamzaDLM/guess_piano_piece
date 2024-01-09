import { data, getElement, getAudio, btnAnswerStyle } from './main';
import { pickRandom, shuffle } from './utils';
import { PianoPiece } from './common.type';
import { initializeCanvas, generateEmojis } from './animation';

const audioBasePath = 'tracks/'

/* Update visual */

function updatePlayButton(state: 'Play' | 'Pause' | 'Next'): void {
	let playButton = getElement('#play')
	if (state == 'Play') {
		playButton.className = "relative flex items-center bg-gradient-to-r from-blue-500 to-zinc-800 mt-16 text-4xl ring-transparent shadow-lg shadow-blue-900 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-700 active:bg-blue-800 text-white font-bold py-2 px-12 rounded-full transition duration-300"
		playButton.innerHTML = `
			<div class="absolute -inset-5">
				<div class="w-full h-full animate-pulse rounded-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-blue-700 to-blue-800"></div>
			</div>
			Play
			<span class="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M211.69 27.27a6 6 0 0 0-5.15-1.09l-128 32A6 6 0 0 0 74 64v114.11A34 34 0 1 0 86 204v-87.32l116-29v58.43A34 34 0 1 0 214 172V32a6 6 0 0 0-2.31-4.73M52 226a22 22 0 1 1 22-22a22 22 0 0 1-22 22m34-121.68V68.68l116-29v35.64ZM180 194a22 22 0 1 1 22-22a22 22 0 0 1-22 22"/></svg></span>
		`
	} else if (state == 'Pause') {
		playButton.className = "relative flex items-center bg-gradient-to-r from-yellow-500 to-zinc-800 mt-16 text-4xl ring-transparent shadow-lg shadow-blue-900 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-700 active:bg-blue-800 text-white font-bold py-2 px-12 rounded-full transition duration-300"
		playButton.innerHTML = `
			<div class="absolute -inset-5">
				<div class="w-full h-full rounded-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r  from-yellow-700 to-yellow-800"></div>
			</div>
			Pause
			<span class="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M200 36h-40a12 12 0 0 0-12 12v160a12 12 0 0 0 12 12h40a12 12 0 0 0 12-12V48a12 12 0 0 0-12-12m4 172a4 4 0 0 1-4 4h-40a4 4 0 0 1-4-4V48a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4ZM96 36H56a12 12 0 0 0-12 12v160a12 12 0 0 0 12 12h40a12 12 0 0 0 12-12V48a12 12 0 0 0-12-12m4 172a4 4 0 0 1-4 4H56a4 4 0 0 1-4-4V48a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4Z"/></svg></span>
		`
	} else {
		playButton.className = "relative flex items-center bg-gradient-to-r from-zinc-500 to-zinc-800 mt-16 text-4xl ring-transparent shadow-lg shadow-blue-900 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-700 active:bg-blue-800 text-white font-bold py-2 px-12 rounded-full transition duration-300"
		playButton.innerHTML = `
			<div class="absolute -inset-5">
				<div class="w-full h-full rounded-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-zinc-700 to-zinc-800"></div>
			</div>
			Next
			<span class="ml-4">
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="m10.537 12l-4.24-4.246q-.141-.14-.154-.341t.153-.367q.16-.16.354-.16t.354.16l4.388 4.389q.131.13.184.267q.053.136.053.298t-.053.298q-.053.137-.184.267l-4.388 4.389q-.14.14-.341.153q-.201.012-.367-.153q-.16-.16-.16-.354t.16-.354zm6.1 0l-4.24-4.246q-.141-.14-.154-.341t.153-.367q.16-.16.354-.16t.354.16l4.388 4.389q.131.13.184.267q.053.136.053.298t-.053.298q-.053.137-.184.267l-4.388 4.389q-.14.14-.341.153q-.201.012-.367-.153q-.16-.16-.16-.354t.16-.354z"/></svg>
			</span>
		`
	}
}

// FIXME: not working
function updateChoiceButtons(): void {
	for (let i = 0; i < 4; i++) {
		let choiceButton = getElement("#answer-" + i)
		if (choiceButton.innerText.includes(data.currentPiece.piece)) {
			choiceButton.className = `${btnAnswerStyle} border-green-600 bg-green-400/10 hover:bg-green-300/10`
		} else if (data.answerSelectedIndex !== null) {
			if (choiceButton.innerText.includes(data.fourPieces[data.answerSelectedIndex].piece) && data.answerStatus === 'incorrect') {
				choiceButton.className = `${btnAnswerStyle} border-red-600 bg-red-500/10 hover:bg-red-300/10`
			}
		} else {
			choiceButton.className = `${btnAnswerStyle} border-zinc-600 bg-zinc-200/5 hover:bg-zinc-200/10`
		}
	}
}

function updateStats(): void {
	getElement("#played").innerText = data.game_count.toString()
	getElement("#correct").innerText = data.win_count.toString()
	getElement("#incorrect").innerText = (data.game_count - data.win_count).toString()
}

/* Game logic */

export function init(): void {
	// retrieve data from localStorage
	if (localStorage.game_count) {
		data.game_count = localStorage.game_count
	}
	if (localStorage.win_count) {
		data.win_count = localStorage.win_count
	}

	initializeCanvas()

	// add eventlistener to the play button
	getElement('#play').addEventListener('click', () => {
		data.started = true
		if (!data.playing && !data.answered) {
			togglePlay()
		} else if (data.playing && !data.answered) {
			togglePlay()
		} else if (data.answered) {
			next()
		}
	})

	getElement('#resetstats').addEventListener('click', () => {
		localStorage.clear()
		window.location.reload()
	})
	prepGame();
}

function togglePlay(): void {
	if (data.playing) {
		audioStop()
		updatePlayButton('Play')
		data.playing = false
	} else {
		audioPlay()
		updatePlayButton('Pause')
		data.playing = true
	}
	updateStats()
}

function prepGame(): void {
	// pick random index
	var randIndex = Math.floor(Math.random() * data.pieces.length)
	// Pick
	data.currentPiece = data.pieces[randIndex]
	data.fourPieces.push(data.currentPiece)
	// Remove
	data.pieces.splice(randIndex, 1)
	// get 3 false answers
	data.fourPieces.push(...pickRandom(data.pieces, 3))
	// Shuffle the four pieces so we don't get same answer position for buttons
	shuffle(data.fourPieces)

	// update audio source to point to the chosen piece
	let audioElement = getAudio()
	audioElement.src = audioBasePath + data.currentPiece.link
	
	// update button text
	for (let i = 0; i < 4; i++) {
		// populate button text
		let button = getElement('#answer-' + i)
		let piece = data.fourPieces[i]
		button.innerHTML = `<p>${piece.piece}<p class="mt-2 text-sm lg:text-xl font-semibold pt-2 border-t border-zinc-800 tracking-wider text-zinc-400/80">${piece.composer}</p></p>`
		// handle click 
		button.addEventListener('click', () => submitAnswer(i))
	}
	updateStats()
}

function audioPlay(): void {
	generateEmojis()
	let audioElement = getAudio()
	// audioElement.volume = 0.5
	audioElement.play()
}

function audioStop(): void {
	let audioElement = getAudio()
	audioElement.pause()
}

function next(): void {
	// Reset data
	data.fourPieces = [] as PianoPiece[]
	data.currentPiece = {} as PianoPiece
	data.answered = false
	data.answerStatus = null
	data.playing = true
	data.answerSelectedIndex = null
	updateChoiceButtons()
	updatePlayButton('Pause')
	prepGame()
	updateStats()
	audioPlay()
}

function submitAnswer(index: number): void {
	if (data.answered === false && data.started == true) {
		data.answerSelectedIndex = index
		data.game_count++
		// Pause the audio
		audioStop()
		data.playing = false
		// Logic
		data.answered = true
		if (data.fourPieces[index].link === data.currentPiece.link) {
			data.answerStatus = 'correct'
			data.win_count++
		} else {
			data.answerStatus = 'incorrect'
		}
		updatePlayButton("Next")
		updateChoiceButtons()
		data.pieces.push(data.currentPiece)
		// set localstorage
		localStorage.win_count = data.win_count
		localStorage.game_count = data.game_count
	}
	updateStats()
}
