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
  const currentGame = new Game(mode, canvas, canvas2, canvas3, 
    ctx, ctx2, ctx3, keyboarder, player1Character, Ninja, level);

  //mode === 'versus' ? currentGame.versus() : currentGame.coop();
  currentGame.singlePlayer()
  setTimeout(() => currentGame.gameLoop(), 450);
}


//menu events and variables
let mode = "singlePlayer";
let level;
const menu = document.querySelector('#menu');
const coop = document.querySelector('.coop');

coop.focus()

coop.addEventListener('click', () => {
  menu.style.zIndex = -1;
  mode = 'coop';
})

//character selection events and variables
let player1Character;
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
    characterSelection.style.zIndex = -1;
    startGame();
  } 
})

assassinSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = Ninja;
    characterSelection.style.zIndex = -1;
    startGame();
  } 
})

mageSelect.addEventListener('click', () => {
  if (!player1Character) {
    player1Character = Mage;
    characterSelection.style.zIndex = -1;
    startGame();
  }
})


const selectLevel1 = document.querySelector('.select-level-1');
const selectLevel2 = document.querySelector('.select-level-2');
const selectLevel3 = document.querySelector('.select-level-3'); 

selectLevel1.addEventListener('click', () => {
  level = 'level1';
})

selectLevel2.addEventListener('click', () => {
  level = 'level2';
})

selectLevel3.addEventListener('click', () => {
  level = 'level3';
})



