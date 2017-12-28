const sounds = {
  archerBow: () => { 
    console.log('make noise please')
    let bowSound = new Audio('../assets/audio-assets/bow.mp3')
    bowSound.play()
    console.log(bowSound)
  }

}

module.exports = sounds