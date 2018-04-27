class Keyboarder {
  constructor() {
    this.keyState = {80: true}; //32 = spacebar
    this.playerKeys = {
      player1: {
        left: 37, 
        right: 39, 
        jump: 38, 
        shoot: 32
      },
      player2: {
        left: 219, 
        right: 220, 
        jump: 187, 
        shoot: 80
      }
    }
    window.onkeydown = (e) => {
      if (e.keyCode === 80) {
        e.preventDefault();
        this.keyState[80] = !this.keyState[80];
      } else {
        this.keyState[e.keyCode] = true;
      }
    }
    window.onkeyup = (e) => {
      if (e.keyCode === 80) {
        e.preventDefault();
        return;
      } else {
        this.keyState[e.keyCode] = false;
      }
    }
  }

  isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }
}

module.exports = Keyboarder;
