
export default {
  pickRandom,
  perc2color,
};

function pickRandom(arr,count) {
    let _arr = [...arr]
    return [...Array(count)].map( ()=> _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0] )
}

function perc2color(perc) {
      var r, g, b = 0;
      if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
      }
      else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
      }
      var h = r * 0x10000 + g * 0x100 + b * 0x1;
      return '#' + ('000000' + h.toString(16)).slice(-6);
}