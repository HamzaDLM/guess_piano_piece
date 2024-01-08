import './style.css';
import { init } from './logic.ts';
import PianoPieces from './assets/pieces.json'
import { ReactiveData, PianoPiece } from './common.type.ts';

// https://dribbble.com/shots/19929919-Game-UI-Kit-Gambling right card bottom
// TODO: recover the deleted assets after I get my 5g back

export let data: ReactiveData = {
	counter: 0,
	// Stores
	pieces: PianoPieces,
	fourPieces: [] as PianoPiece[],
	currentPiece: {} as PianoPiece,
	// Game stats
	game_count: 0, // How many times user played
	win_count: 0,
	// States
	started: false, // Indicate the beginning of the game loop
	playing: false,
	answered: false,
	answerStatus: null, // is the answer 'correct' or 'incorrect'
	answerSelectedIndex: null,
}

export const btnAnswerStyle = "text-lg text-zinc-300 font-medium rounded-lg border h-44 px-4 py-2 transition duration-300 hover:shadow-xl hover:shadow-zinc-900"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="h-screen w-screen flex flex-col bg-gradient-to-bl from-zinc-950 to-zinc-800 z-50">
	<!-- Header section -->
	<div class="flex justify-center flex-col text-center items-center z-50">
		<h1 class="pt-32 text-7xl text-zinc-200 font-bold">
			Guess the following classical piano piece</h1>
		<h2 class="mt-4 text-3xl text-zinc-400 px-20">Listen to the following classical piano piece and try to guess the answer out of the four given.</h2>
		<button id="play" class="relative flex items-center bg-gradient-to-r from-blue-500 to-zinc-800 mt-16 text-4xl shadow-lg shadow-blue-900 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-700 active:bg-blue-800 text-white font-bold py-2 px-12 rounded-full transition duration-300">
			<div class="absolute -inset-5">
				<div class="w-full h-full animate-pulse rounded-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-blue-700 to-blue-800"></div>
			</div>
			Play
			<span class="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M211.69 27.27a6 6 0 0 0-5.15-1.09l-128 32A6 6 0 0 0 74 64v114.11A34 34 0 1 0 86 204v-87.32l116-29v58.43A34 34 0 1 0 214 172V32a6 6 0 0 0-2.31-4.73M52 226a22 22 0 1 1 22-22a22 22 0 0 1-22 22m34-121.68V68.68l116-29v35.64ZM180 194a22 22 0 1 1 22-22a22 22 0 0 1-22 22"/></svg></span>
		</button>
	</div>
	
	<audio id="audio" src="" type="audio/ogg">
  		Your browser does not support the audio element.
	</audio>

	<!-- Answer buttons -->
	<div class="mx-32 mt-20 grid text-white text-center grid-cols-2 xl:grid-cols-4 gap-8 my-7 z-50">
		<button id="answer-0" class="${btnAnswerStyle} border-zinc-600 bg-zinc-200/5 hover:bg-zinc-200/10" type="button">
		<span class="text-xl  text-white">Composer</span> 
		</button>
		<button id="answer-1" class="${btnAnswerStyle} border-zinc-600 bg-zinc-200/5 hover:bg-zinc-200/10" type="button">
		<span class="text-xl text-white">Composer</span>
		</button>
		<button id="answer-2" class="${btnAnswerStyle} border-zinc-600 bg-zinc-200/5 hover:bg-zinc-200/10" type="button">
		<span class="text-xl text-white">Composer</span>
		</button>
		<button id="answer-3" class="${btnAnswerStyle} border-zinc-600 bg-zinc-200/5 hover:bg-zinc-200/10" type="button">
		<span class="text-xl text-white">Composer</span>
		</button>
	</div>

	<!-- Game stats -->
	<div id="stats" class="mt-10 flex justify-center gap-36 text-4xl text-white px-52 z-50">
		<div class="border-l-4 border-zinc-200/20 pl-7">
			<p class="text-5xl font-bold text-zinc-500/20">Played</p>
			<p id="played" class="text-5xl font-bold text-zinc-200/20">120</p>
		</div>	
		<div class="border-l-4 border-green-300/20 pl-7">
			<p class="text-5xl font-bold text-zinc-500/20">Correct</p>
			<p id="correct" class="text-5xl font-bold text-green-300/20">99</p>
		</div>	
		<div class="border-l-4 border-red-300/20 pl-7">
			<p class="text-5xl font-bold text-zinc-500/20">Incorrect</p>
			<p id="incorrect" class="text-5xl font-bold text-red-300/20">31</p>
		</div>	
	</div>
   
	<!-- Bottom section -->
	<div class="px-52 flex justify-between mb-10 mt-auto text-xl text-zinc-600 z-50">
   		<div class="flex gap-6 items-center">
			<!-- <button class="flex hover:text-zinc-500 gap-2 tracking-wider items-center"> -->
			<!-- 	<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M8 12h8v-2H8zm0-4h8V6H8zm11.95 12.475L15.9 15.2q-.425-.575-1.05-.887T13.5 14H4V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .125-.012.238t-.038.237M6 22q-.825 0-1.412-.587T4 20v-4h9.5q.25 0 .463.113t.362.312l4.2 5.5q-.125.05-.262.063T18 22z"/></svg> -->
			<!-- 	Credits	 -->
			<!-- </button> -->
   <!-- 			<button class="flex hover:text-zinc-500 gap-2 tracking-wider items-center"> -->
			<!-- 	<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M21 3h-3V1h-2v2H8V1H6v2H3v18h18zm-9 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3m6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/></svg> -->
			<!-- 	Contact	 -->
			<!-- </button> -->
		</div>

   		<div class="flex gap-6 items-center">
   			<button id="resetstats" class="flex hover:text-zinc-500 gap-2 tracking-wider items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M6.78 2.72a.75.75 0 0 1 0 1.06L4.56 6h8.69a7.75 7.75 0 1 1-7.75 7.75a.75.75 0 0 1 1.5 0a6.25 6.25 0 1 0 6.25-6.25H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 0"/></svg>
				<!-- <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M21 3h-3V1h-2v2H8V1H6v2H3v18h18zm-9 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3m6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/></svg> -->
				Reset Stats
			</button>
		</div>
   	</div>
    
	<!-- Github corner -->
	<a href="https://github.com/HamzaDLM/guess_piano_piece" target="_blank" class="github-corner z-50" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#fff; color:#151513; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
</div>
<canvas id="canvas" class="h-screen w-screen bottom-0 absolute z-0"></canvas>
`;

// needed ?
document.addEventListener('DOMContentLoaded', function() {
	init();
});

export function getAudio(): HTMLAudioElement {
	let audioElement = document.querySelector('audio')
	if (audioElement) {
		return audioElement
	}
	throw new Error("Audio Element not found")
}

// Refactor to include all types, generics?
export function getElement(id: string): HTMLButtonElement {
	return document.querySelector<HTMLButtonElement>(id)!
}


