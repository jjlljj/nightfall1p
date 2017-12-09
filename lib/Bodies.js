class Bodies {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  //17-21 simplfy into another function etc.
  isColliding(array) {
    let isColliding = false;
    const topRight = this.x + this.width;
    const footLevel = this.y + this.height;

    array.forEach(({x, y, width, height}) => {
    const bodyFootLevel = y + height;
      if ((topRight > x)
        && !(this.y >= bodyFootLevel 
        || footLevel - 10 <= y)
        && ((this.x < x + width) 
        && !(this.y >= bodyFootLevel
        || footLevel - 10 <= y))
      ) {
        isColliding = true;
      } 
    })
    return isColliding;
  }
}

module.exports = Bodies;