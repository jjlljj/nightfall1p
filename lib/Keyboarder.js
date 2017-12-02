class Keyboarder {
  constructor() {
    this.keyState = {};
    window.onkeydown = (e) => this.keyState[e.keyCode] = true;
    window.onkeyup = (e) => this.keyState[e.keyCode] = false;
  }

  isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }
}

module.exports = Keyboarder;