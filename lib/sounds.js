let bowSound 
let fireballSound 
let assassinThrow
let playerHit
let jokerLaugh

let soundTrack
  
const sounds = {
  shoot: {
    archer: () => {
      if (!bowSound) {
        bowSound = new Audio('../assets/audio-assets/bow.mp3')
        bowSound.volume = 0.1
      }
      console.log(bowSound.volume)
      bowSound.play()
    },
    mage: () => {
      if (!fireballSound) {
        fireballSound = new Audio('../assets/audio-assets/fireball.mp3')
        fireballSound.volume = 0.1
      }
      fireballSound.play()
    },
    assassin: () => {
      if (!assassinThrow) {
        assassinThrow = new Audio('../assets/audio-assets/assassin-throw.mp3')
        assassinThrow.volume = 0.1
      }
      assassinThrow.play()
    }
  },
  hit: {
    archer: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
        playerHit.volume = 0.2
      }
      playerHit.play()
    },
    mage: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
        playerHit.volume = 0.2
      }
      playerHit.play()
    },
    assassin: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
        playerHit.volume = 0.2
      }
      playerHit.play()
    },
    enemy: () => {
      if(!playerHit) {
        playerHit = new Audio('../assets/audio-assets/hit-reaction.mp3')
        playerHit.volume = 0.2
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
  },
  soundTrack: {
    menu: () => {
      if (soundTrack) {
        soundTrack.pause()
      }
      soundTrack = new Audio('../assets/audio-assets/menusong.mp3')
      soundTrack.loop = true
      soundTrack.play()
    },
    level1: () => {
      if (soundTrack) {
        soundTrack.pause()
      }
      //soundTrack = new Audio('../assets/audio-assets/menusong.mp3')
      //soundTrack.loop = true
      //soundTrack.play()
    },
    level2: () => {
      if (soundTrack) {
        soundTrack.pause()
      }
      //soundTrack = new Audio('../assets/audio-assets/menusong.mp3')
      //soundTrack.loop = true
      //soundTrack.play()
    },
    level3: () => {
      if (soundTrack) {
        soundTrack.pause()
      }
      //soundTrack = new Audio('../assets/audio-assets/menusong.mp3')
      //soundTrack.loop = true
      //soundTrack.play()
    },


  }



}

module.exports = sounds
