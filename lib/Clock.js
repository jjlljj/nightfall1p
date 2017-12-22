//build a gameClock
//requirements: start, pause, and reset
//performance.now()
//issues: work it into the loop, need events in Game.js to trigger off clock, need timer to pause when controls are displayed
//solution: make new class??

module.exports = class Clock {
  constructor() {
    this.running = false;
  }

  start() {
    if(!this.time) this.time = performance.now();
    if(!this.running) this.running = true;
  }

  pause() {
    this.running = false;
    this.time = null;
  }

  reset() {

  }
}