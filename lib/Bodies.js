class Bodies {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isColliding(array) {
    let isColliding = false;

    for (let i = 0; i < array.length; i++) {
      if ((this.x + this.width > array[i].x) 
          && !(this.y >= array[i].y + array[i].height 
          || this.y + this.height - 10 <= array[i].y)
          && ((this.x < array[i].x + array[i].width) 
          && !(this.y >= array[i].y + array[i].height 
          || this.y + this.height - 10 <= array[i].y))
      ) {
        isColliding = true;
      } 
    }
    return isColliding;
  }
}

module.exports = Bodies;