<script>
import PianoDB from '../backend/store-v2'
import utils from '../backend/utils'

export default {
  name: 'pageIndex',
  data() {
    return {
      // Stores
      db: PianoDB,
      fourPieces: [],
      currentPiece: null,
      // Game stats
      game_count: 0, // How many times user played
      win_count: 0,
      // States
      playing: false,
      answered: false,
      answerStatus: null, // is the answer 'correct' or 'incorrect'
      isSelected: [],
    } 
  },
  mounted() {
  //   if (localStorage.game_count) {
  //     this.game_count = localStorage.game_count
  //   }
  //   if (localStorage.win_count) {
  //     this.win_count = localStorage.win_count
  //   }
  },
  created() {
    this.prepGame()
    console.log(this.db.length)
  },
  computed: {
    percentage() {
      return Math.round(( this.win_count / this.game_count ) * 100)
    }
  },
  methods: {
    ...utils,
    prepGame() {
      // pick random index
      var randIndex = [Math.floor(Math.random() * this.db.length)]
      // Pick
      this.currentPiece = this.db[randIndex]
      this.fourPieces.push(this.currentPiece)
      // Remove
      this.db.splice(randIndex, 1)
      // get 3 false answers
      this.fourPieces.push(...this.pickRandom(this.db, 3))
      // Shuffle the four pieces so we don't get same answer position for buttons
      this.shuffle(this.fourPieces)
    },
    togglePlay() {
      let audio = this.$refs.audioPlayer
      if (this.playing) {
        audio.pause()
        this.playing = false
      } else {
        audio.play()
        this.playing = true
      }
    },
    submitAnswer(params) {
      if (this.answered == false) {
        this.game_count ++
        // Pause the audio
        let audio = this.$refs.audioPlayer
        audio.pause()
        this.playing = false
        // Logic
        this.answered = true
        this.isSelected.push(params.index)
        if (params.data == this.currentPiece) {
          this.answerStatus = 'correct'
          this.win_count ++
        } else {
          this.answerStatus = 'incorrect'
        }
        this.db.push(this.currentPiece)
        // set localstorage
        localStorage.win_count = this.win_count
        localStorage.game_count = this.game_count
      }
    },
    next() {
      this.currentPiece = null
      this.fourPieces = []
      this.isSelected = []
      this.answerStatus = null
      this.answered = false
      this.prepGame()
    }
  }
}
</script>

<template>
  <div>
    <div class="disclaimer" >
    </div>
    <div class="top-container bg-image">
      <h1 class="title">Guess the following classical piano piece</h1>
      <h5 class="description">Listen to the following classical piano piece and try to guess the answer out of the four given.</h5>

      <div class="play text-center">
        <audio :src="`tracks/` + currentPiece.link" preload="auto" ref="audioPlayer"></audio>
        <button v-if="!playing && !answered" type="button" class="btn btn-primary m-2 play-button" @click="togglePlay()">Play</button>
        <button v-if="playing && !answered" type="button" class="btn btn-secondary m-2 play-button" @click="togglePlay()">Pause</button>
        <button v-if="answered" type="button" class="btn btn-warning m-2 play-button" @click="next()">Next</button>
      </div>
        
      
    </div>
    
    <div class="answers">
      <div class="row m-sm-4">
        <div v-for="(data, index) in fourPieces" :key="index" class="col-md-3 col-12 col-sm-6 options">
          <button 
          type="button" 
          class="btn option-button" 
          :class="{
            'btn-normal': !isSelected.includes(index),
            'btn-success': isSelected.includes(index) && answerStatus == 'correct',
            'btn-danger': isSelected.includes(index) && answerStatus == 'incorrect'
          }" 
            @click="submitAnswer({ index, data })"
            >
            {{ data.piece }}<br/>{{ data.composer }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="bot-container">
      <div class="row">
        <div class="col-sm-4 col-4">
          <p class="stats-title">{{game_count}}</p>
          <p class="stats-description">How many times you played <br/> this game</p>
        </div>
        <div class="col-sm-4 col-4">
          <p class="stats-title">{{win_count}}/{{game_count - win_count}}</p>
          <p class="stats-description">Correct / Incorrect <br/> pieces guessed</p>
        </div>
        <div class="col-sm-4 col-4">
          <p class="stats-title" :style="{color: perc2color(percentage)}">{{percentage}} %</p>
          <p class="stats-description">Win ratio</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-container">
        <div class="row m-0">
          <div class="col-sm-6 col-8 mt-1">
            © {{new Date().getFullYear()}} Hamza Dellam | 
            <span><a href="#" type="button" data-bs-toggle="modal" data-bs-target="#creditsModal">Credits</a></span>
            | <span><a href="#" type="button" data-bs-toggle="modal" data-bs-target="#contactmeModal">Contact me</a></span>

          </div>
          <div class="col-sm-6 col-4 contact">
            
            <a href="https://github.com/HamzaDLM" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
                width="25" height="25">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
              </svg>
            </a>

            <a href="https://www.linkedin.com/in/hamzadellam/" target="_blank">
              <svg xmlns:xlink="http://www.w3.org/1999/xlink" style="enable-background:new 0 0 40 40;" version="1.1" viewBox="0 0 67 67"
                width="25px" height="25px">
                <path d="M50.837,48.137V36.425c0-6.275-3.35-9.195-7.816-9.195  c-3.604,0-5.219,1.983-6.119,3.374V27.71h-6.79c0.09,1.917,0,20.427,0,20.427h6.79V36.729c0-0.609,0.044-1.219,0.224-1.655  c0.49-1.22,1.607-2.483,3.482-2.483c2.458,0,3.44,1.873,3.44,4.618v10.929H50.837z M22.959,24.922c2.367,0,3.842-1.57,3.842-3.531  c-0.044-2.003-1.475-3.528-3.797-3.528s-3.841,1.524-3.841,3.528c0,1.961,1.474,3.531,3.753,3.531H22.959z M34,64  C17.432,64,4,50.568,4,34C4,17.431,17.432,4,34,4s30,13.431,30,30C64,50.568,50.568,64,34,64z M26.354,48.137V27.71h-6.789v20.427  H26.354z" />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </footer>

    <div class="modal " id="creditsModal" tabindex="-1">
      <div class="modal-dialog text-start modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Credits</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>The audio (MP3, OGG) files used in this website are of <mark>Bernd Krueger</mark> and are licensed under the <span><a href="https://creativecommons.org/licenses/by-sa/3.0/de/deed.en">cc-by-sa Germany License</a></span>.</p>
            <p>Source: <span><a href="http://www.piano-midi.de">http://www.piano-midi.de</a></span></p>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>

    <div class="modal " id="contactmeModal" tabindex="-1">
      <div class="modal-dialog text-start modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Contact me</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>You can contact me via the following email:</p>
            <span><a href="mailto:hamzadellam@hotmail.com">hamzadellam@hotmail.com</a></span>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>

</style>