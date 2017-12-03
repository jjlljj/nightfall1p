const Game = require('./Game.js')
const resetGameButton = document.getElementById('new-game');


resetGameButton.addEventListener('click', () => {thisGame = new Game()});

let thisGame = new Game();