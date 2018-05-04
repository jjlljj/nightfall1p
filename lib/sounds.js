let bowSound 
let fireballSound 
let assassinThrow
let playerHit
let jokerLaugh
  
const sounds = {
  shoot: {
    archer: () => {
      if (!bowSound) {
        bowSound = new Audio('../assets/audio-assets/bow.mp3')
      }
      bowSound.play()
    },
    mage: () => {
      if (!fireballSound) {
        fireballSound = new Audio('../assets/audio-assets/fireball.mp3')
      }
      fireballSound.play()
    },
    assassin: () => {
      if (!assassinThrow) {
        assassinThrow = new Audio('../assets/audio-assets/assassin-throw.mp3')
      }
      assassinThrow.play()
    }
  },
  hit: {
    archer: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
      }
      playerHit.play()
    },
    mage: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
      }
      playerHit.play()
    },
    assassin: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
      }
      playerHit.play()
    },
    enemy: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
      }
      playerHit.play()
    }
  },
  spawn: {
    joker: () => {
      if(!jokerLaugh) {
        jokerLaugh = new Audio('../assets/audio-assets/evil-laugh.mp3')
      }
      jokerLaugh.play()
    }
  }

}

module.exports = sounds
