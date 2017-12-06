class Keyboarder {
  constructor() {
    this.keyState = {32: true}; //32 = spacebar
    this.playerKeys = {player1: {left: 65, right:68, jump: 87, shoot:16}, player2: {left: 219, right:220, jump: 187, shoot:80}}
    window.onkeydown = (e) => {
     
      if (e.keyCode === 32) {
        e.preventDefault();
        this.keyState[32] === true ? this.keyState[32] = false : this.keyState[32] = true;
      } else {
      this.keyState[e.keyCode] = true;
      }
    }
    window.onkeyup = (e) => {
      if (e.keyCode === 32) {
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