const level = [

//left
  {
    name: 'left-side',
    src: '../assets/level1/l-side.png',
    visible: true,
    detect: true,
    x: 0,
    y: 200,
    width: 60,
    height: 400,
    dx: 0,
    dy: 193,
    dWidth: 60,
    dHeight: 415
  }, 
  {
    name: 'left-lower-level',
    src: '../assets/level1/l-lower-level.png',
    visible: true,
    detect: true,
    x: 0,
    y: 600,
    width: 300,
    height: 50,
    dx: 0,
    dy: 585,
    dWidth: 320,
    dHeight: 65
  },
  {
    name: 'left-ground',
    src: '../assets/level1/l-ground.png',
    visible: true,
    detect: true,
    x: 0,
    y: 650,
    width: 450,
    height: 50,
    dx: 0,
    dy: 635,
    dWidth: 470,
    dHeight: 70
  },
  {
    name: 'left-side-ledge',
    src: '../assets/level1/l-side-ledge.png',
    visible: true,
    detect: true,
    x: 30,
    y: 430,
    width: 30,
    height: 30,
    dx: 30,
    dy: 430,
    dWidth: 30,
    dHeight: 30
  },

  //right
  {
    name: 'right-side',
    src: '../assets/level1/r-side.png',
    visible: true,
    detect: true,
    x: 940,
    y: 200,
    width: 65,
    height: 400,
    dx: 940,
    dy: 193,
    dWidth: 60,
    dHeight: 415
  }, 
  {
    name: 'right-lower-level',
    src: '../assets/level1/r-lower-level.png',
    visible: true,
    detect: true,
    x: 700,
    y: 600,
    width: 300,
    height: 50,
    dx: 685,
    dy: 585,
    dWidth: 320,
    dHeight: 65
  },
  {
    name: 'right-ground',
    src: '../assets/level1/r-ground.png',
    visible: true,
    detect: true,
    x: 550,
    y: 650,
    width: 450,
    height: 50,
    dx: 535,
    dy: 635,
    dWidth: 470,
    dHeight: 70
  }, 
  {
    name: 'right-side-ledge',
    src: '../assets/level1/r-side-ledge.png',
    visible: true,
    detect: true,
    x: 940,
    y: 430,
    width: 30,
    height: 30,
    dx: 940,
    dy: 430,
    dWidth: 30,
    dHeight: 30
  },

  //platforms
  {
    name: 'center-platform-tree',
    src: '../assets/level1/center-platform-tree.png',
    visible: true,
    detect: true,
    x: 500,
    y: 400,
    width: 10,
    height: 50,
    dx: 415,
    dy: 265,
    dWidth: 160,
    dHeight: 180
  }, 
  {
    name: 'center-platform-low',
    src: '../assets/level1/center-platform-low.png',
    visible: true,
    detect: true,
    x: 375,
    y: 442,
    width: 250,
    height: 30,
    dx: 370,
    dy: 440,
    dWidth: 260,
    dHeight: 33
  },
  {
    name: 'center-platform-high',
    src: '../assets/level1/center-platform-high.png',
    visible: true,
    detect: true,
    x: 310,
    y: 120,
    width: 370,
    height: 30,
    dx: 310,
    dy: 117,
    dWidth: 380,
    dHeight: 33
  },

  {
    name: 'left-platform',
    src: '../assets/level1/side-platform.png',
    visible: true,
    detect: true,
    x: 140,
    y: 280,
    width: 120,
    height: 10,
    dx: 138,
    dy: 280,
    dWidth: 120,
    dHeight: 95
  },
  {
    name: 'right-platform',
    src: '../assets/level1/side-platform.png',
    visible: true,
    detect: true,
    x: 740,
    y: 280,
    width: 120,
    height: 10,
    dx: 738,
    dy: 280,
    dWidth: 120,
    dHeight: 95
  },
  

]

module.exports = level;