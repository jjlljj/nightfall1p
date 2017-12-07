const { expect } = require('chai')
const Bodies = require('../lib/Bodies.js')

describe('Bodies', () => {

  const platforms = [{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
  const body = new Bodies(175, 75, 50, 50);

  it('should know when it is colliding with something', () => {
    expect(body.isColliding(platforms)).to.equal(false);
    body.y = 125;
    expect(body.isColliding(platforms)).to.equal(true);
  })


})