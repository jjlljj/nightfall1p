class Keyboarder {
  constructor() {
    this.keyState = {32: true}; //32 = spacebar
    window.onkeydown = (e) => {
      e.preventDefault();
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