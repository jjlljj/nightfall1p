const Game = require('./Game.js')
const resetGameButton = document.getElementById('new-game');


resetGameButton.addEventListener('click', () => {currentGame = new Game()});

let currentGame = new Game();