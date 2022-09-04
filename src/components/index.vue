<script>
import PianoDB from '../backend/store'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      db: PianoDB,
      game_count: 0, // How many times user played
      win_count: 0,
      loss_count: 0,
      currentPiece: null,
      playing: false,
      answered: false,
      answerStatus: null, // is the answer 'correct' or 'incorrect'
      answerIndex: null,
      isSelected: [],
    } 
  },
  created() {
    Array.prototype.sample = function(){
      return this[Math.floor(Math.random()*this.length)];
    }
    this.currentPiece = this.db.sample() 
    console.log(this.currentPiece)
  },
  methods: {
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
        // Pause the audio
        let audio = this.$refs.audioPlayer
        audio.pause()
        this.playing = false
        // Logic
        this.answered = true
        this.isSelected.push(params.index)
        if (params.data == this.currentPiece) {
          this.answerStatus = 'correct'
        } else {
          this.answerStatus = 'incorrect'
        }
      }
    },
    next() {
    },
  }
}
</script>

<template>
  <div>

    <div class="container-fluid top-container bg-image">
      <h1 class="title">GUESS THE FOLLOWING CLASSICAL PIANO PIECE</h1>
      <h5 class="description">Listen to the following 15 seconds and try to guess the name</h5>

      <audio v-bind:src="`pieces/` + currentPiece.file_name" preload="auto" autoplay ref="audioPlayer"></audio>
      <button v-if="!playing && !answered" type="button" class="btn btn-primary m-2 play-button" @click="togglePlay()">Play</button>
      <button v-if="playing && !answered" type="button" class="btn btn-secondary m-2 play-button" @click="togglePlay()">Pause</button>
      <button v-if="answered" type="button" class="btn btn-warning m-2 play-button" @click="next()">Next</button>

      <div class="row m-4">
        <div v-for="(data, index) in db" :key="index" class="col-sm-3">
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
          <p class="stats-title">238</p>
          <p class="stats-description">How many times you played <br/> this game</p>
        </div>
        <div class="col-sm-4">
          <p class="stats-title">24/7</p>
          <p class="stats-description">Correct / Incorrect <br/> pieces guessed</p>
        </div>
        <div class="col-sm-4">
          <p class="stats-title">60%</p>
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