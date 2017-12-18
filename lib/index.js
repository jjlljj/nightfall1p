const Game = require('./Game.js')
const Keyboarder = require('./Keyboarder.js');
const canvas = document.getElementById('screen');
const canvas2 = document.getElementById('background');
const canvas3 = document.getElementById('backdrop');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
const keyboarder = new Keyboarder();

function startGame() {
  const currentGame = new Game(canvas, canvas2, canvas3, 
    ctx, ctx2, ctx3, keyboarder, player1Character, player2Character);

  mode === 'versus' ? currentGame.versus() : currentGame.coop();
  setTimeout(() => currentGame.gameLoop(), 450);
}


//menu events and variables
let mode;
const menu = document.querySelector('#menu');
const versus = document.querySelector('.versus');
const coop = document.querySelector('.coop');

versus.addEventListener('click', () => {
  menu.style.zIndex = -1;
  mode = 'versus';
})

coop.addEventListener('click', () => {
  menu.style.zIndex = -1;
  mode = 'coop';
})

//character selection events and variables
let player1Character;
let player2Character;
const characterSelection = document.querySelector('#character-selection');
const selectText = document.querySelector('.select-text')
const archerSelect = document.querySelector('.archer');
const assassinSelect = document.querySelector('.assassin');
const mageSelect = document.querySelector('.mage');
const Player = require('./Player.js');
const Ninja = require('./Ninja.js');
const Mage = require('./Mage.js');

archerSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = Player;
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = Player;
    characterSelection.style.zIndex = -1;
    startGame();
  }
})

assassinSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = Ninja;
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = Ninja;
    characterSelection.style.zIndex = -1;
    startGame();
  }
})

mageSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = Mage;
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = Mage;
    characterSelection.style.zIndex = -1;
    startGame();
  }
})





