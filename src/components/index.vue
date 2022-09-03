<template>
  <div class="container bg-secondary m-0 p-0">

      <div class="">
        <h1>GUESS THE FOLLOWING CLASSICAL PIANO PIECE</h1>
        <p>Listen to the following 15 seconds and try to guess the name</p>
        <button type="button" class="btn btn-primary">Play</button>
      </div>

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
      ]
    }
      
  }
}
</script>