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


//menu events and variables
const menu = document.querySelector('#menu');
const versus = document.querySelector('.versus');
const coop = document.querySelector('.coop');

versus.addEventListener('click', () => {
  menu.style.zIndex = -1;
})

coop.addEventListener('click', () => {
  menu.style.zIndex = -1;
})

//character selection events and variables
let player1Character;
let player2Character;
const characterSelection = document.querySelector('#character-selection');
const selectText = document.querySelector('.select-text')
const archerSelect = document.querySelector('.archer');
const assassinSelect = document.querySelector('.assassin');
const mageSelect = document.querySelector('.mage');

archerSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = 'archer';
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = 'archer';
    characterSelection.style.zIndex = -1;
  }
})

assassinSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = 'assassin';
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = 'assassin';
    characterSelection.style.zIndex = -1;
  }
})

mageSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = 'mage';
    selectText.innerHTML = 'Player 2 (right side) choose your character:'
  } else {
    player2Character = 'mage';
    characterSelection.style.zIndex = -1;
  }
})





