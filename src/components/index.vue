<template>
  <div>

    <div class="container-fluid top-container bg-image m-0 p-0">
      <h1 class="title">GUESS THE FOLLOWING CLASSICAL PIANO PIECE</h1>
      <p class="description">Listen to the following 15 seconds and try to guess the name</p>
      <button type="button" class="btn btn-primary">Play</button>

      <div class="row m-4">
        <div v-for="(data, index) in data" :key="index" class="col-sm-3">
          <div class="card">
            <button type="button" class="btn btn-primary">{{ data.piece }}<br/>{{ data.composer }}</button>
          </div>
        </div>
      </div>

      <div class="row m-4">
        <div class="col-sm-4">
          238
        </div>
        <div class="col-sm-4">
          24/7
        </div>
        <div class="col-sm-4">
          60%
        </div>
      </div>
    </div>
    <div class="container-fuild bot-container m-0 p-0">
        <p>fefk</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      data: [
        {
          composer: 'Ludwig van Beethoven',
          piece: 'Moonlight Sonata'
        },
        {
          composer: 'Franz Liszt',
          piece: 'Liebestraum No. 3'
        },
        {
          composer: 'Frédéric Chopin',
          piece: 'Prelude in Em'
        },
        {
          composer: 'Ludwig van Beethoven',
          piece: 'Für Elise'
        }
      ],
      game_count: 0, // How many times user played
      win_count: 0,
      loss_count: 0,
    }
      
  },
}
</script>

<style>
    .top-container {
      padding-top: 60px !important;
      height: 60vh;
      background-image: url(@/assets/vgogh.jpg)
    }
    .bot-container {
      height: 40vh;
      background-color: #181818;
    }
    .title {
      font-family: montserrat bold;
      color: white;
    }
    .description {
      color: white;
    }
</style>