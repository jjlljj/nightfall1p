const Game = require('./Game.js')
const Keyboarder = require('./Keyboarder.js');
const canvas = document.getElementById('screen');
const canvas2 = document.getElementById('background');
const canvas3 = document.getElementById('backdrop');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
const keyboarder = new Keyboarder();

let currentGame = new Game(canvas, canvas2, canvas3, 
  ctx, ctx2, ctx3, keyboarder);

setTimeout(() => currentGame.gameLoop(), 450);

