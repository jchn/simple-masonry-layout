import test from 'ava'
import LayoutEngine from '../lib/engine'

test('layout order should be maintained when dimensions are the same', (t) => {

  const dimensions = []

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: 500, height: 500, order: i })
  }

  const rectangles = LayoutEngine.generateRectangles(dimensions, 5, 2500, 0)

  const expectedPattern = []
  for (let i = 0; i < 20; i++) {
    expectedPattern.push({
      x: ((i * 500) % 2500),
      y: ((Math.floor(i / 5)) * 500)
    })
  }

  const returnedPattern = rectangles.map(rectangle => ({ x: rectangle.x, y: rectangle.y }))

  t.same(returnedPattern, expectedPattern)
})

test('x and y gutter should be configured separately', (t) => {

  const dimensions = []

  const gutterX = 20
  const gutterY = 50

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: 500, height: 500 })
  }

  const rectangles = LayoutEngine.generateRectangles(dimensions, 5, 2600, 0, gutterX, gutterY)

  const expectedPattern = []

  for (let i = 0; i < 20; i++) {

    const x = (i * 500 % 2500) + (i % 5 * gutterX)
    let y = ((Math.floor(i / 5)) * 500)

    if (y) y += gutterY * Math.floor(i / 5)

    expectedPattern.push({
      x: x,
      y: y
    })
  }

  const returnedPattern = rectangles.map(rectangle => ({ x: rectangle.x, y: rectangle.y }))

  t.same(returnedPattern, expectedPattern)
})