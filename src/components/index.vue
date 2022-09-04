<script>
import PianoDB from '../backend/store'
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
      loss_count: 0,
      // States
      playing: false,
      answered: false,
      answerStatus: null, // is the answer 'correct' or 'incorrect'
      isSelected: [],
    } 
  },
  created() {
    this.prepGame()
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
    },
    togglePlay() {
      console.log('called')
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
          this.loss_count ++
        }
        this.db.push(this.currentPiece)
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

    <div class="container-fluid top-container bg-image">
      <h1 class="title">GUESS THE FOLLOWING CLASSICAL PIANO PIECE</h1>
      <h5 class="description">Listen to the following classical piano piece and try to guess the answer out of the four given.</h5>

      <audio v-bind:src="`pieces/` + currentPiece.file_name" preload="auto" ref="audioPlayer"></audio>
      <button v-if="!playing && !answered" type="button" class="btn btn-primary m-2 play-button" @click="togglePlay()">Play</button>
      <button v-if="playing && !answered" type="button" class="btn btn-secondary m-2 play-button" @click="togglePlay()">Pause</button>
      <button v-if="answered" type="button" class="btn btn-warning m-2 play-button" @click="next()">Next</button>

      <div class="row m-4">
        <div v-for="(data, index) in fourPieces" :key="index" class="col-sm-3">
            <button 
              type="button" 
              class="btn option-button" 
              :class="{
                        'btn-dark': !isSelected.includes(index),
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
    <div class="container-fuild bot-container m-0">
      <div class="row m-0 ">
        <div class="col-sm-4">
          <p class="stats-title">{{game_count}}</p>
          <p class="stats-description">How many times you played <br/> this game</p>
        </div>
        <div class="col-sm-4">
          <p class="stats-title">{{win_count}}/{{loss_count}}</p>
          <p class="stats-description">Correct / Incorrect <br/> pieces guessed</p>
        </div>
        <div class="col-sm-4">
          <p class="stats-title" :style="{color: perc2color(percentage)}">{{percentage}} %</p>
          <p class="stats-description">Win ratio</p>
        </div>
      </div>
    </div>

    <div class="container-fuild footer-container m-0 p-0">
      <div class="row m-0 ">
        <div class="col-6">
          <!-- <p>© {{new Date().getFullYear()}} Hamza Dellam</p> -->
        </div>
        <div class="col-6">
          <!-- <p>something</p> -->
        </div>
      </div>
    </div>

  </div>
</template>

<style>

</style>