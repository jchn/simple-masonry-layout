import test from 'ava'
import LayoutEngine from '../lib/simple-masonry'

function extractDimensions (rectangle) {
  return {
    width: rectangle.width,
    height: rectangle.height
  }
}

test('layout order should be maintained when dimensions are the same', (t) => {

  const dimensions = []

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: 500, height: 500, order: i })
  }

  const rectangles = LayoutEngine.generateRectangles({
    dimensions: dimensions, 
    columns: 5, 
    width: 2500, 
    gutter: 0
  })

  const expectedPattern = []
  for (let i = 0; i < 20; i++) {
    expectedPattern.push({
      x: ((i * 500) % 2500),
      y: ((Math.floor(i / 5)) * 500)
    })
  }

  const returnedPattern = rectangles.map(rectangle => ({ x: rectangle.x, y: rectangle.y }))

  t.deepEqual(returnedPattern, expectedPattern)
})

test('x and y gutter should be separately configurable', (t) => {

  const dimensions = []

  const gutterX = 20
  const gutterY = 50

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: 500, height: 500 })
  }

  const rectangles = LayoutEngine.generateRectangles({
    dimensions: dimensions, 
    columns: 5, 
    width: 2600, 
    gutter: 0, 
    gutterX: gutterX, 
    gutterY: gutterY
  })

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

test('max height should be configurable', (t) => {

  const dimensions = []

  const maxHeight = 800
  const width = 8000

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: 2500, height: 2500 })
  }

  const rectangles = LayoutEngine.generateRectangles({
    dimensions,
    maxHeight,
    width
  })

  t.true(rectangles.every(r => r.height <= maxHeight))

})

test('collapsing should be optional', (t) => {

  const dimensions = []

  const collapsing = true

  for (let i = 0; i < 20; i++) {
    dimensions.push({ width: (Math.random() * 100 + 100), height: (Math.random() * 100 + 100) })
  }

  const rectangles1 = LayoutEngine.generateRectangles({
    dimensions,
    collapsing: true
  })

  const rectangles2 = LayoutEngine.generateRectangles({
    dimensions,
    collapsing: false
  })

  t.notDeepEqual(rectangles1, rectangles2)

})

test('layout order should be maintained when collapsing is turned off', (t) => {

  const dimensions = []
  const columns = 5
  const width = 1000
  const collapsing = true
  const gutter = 0

  for (let i = 1; i < 20; i++) {
    dimensions.push({ width: i * 50 + 100, height: (i * 50 + 100) + i % 3 * 50})
  }

  // we expect to get back the scaled dimensions in the same order as they were entered
  const expectedPattern = dimensions
    .map(LayoutEngine.__scaleRectangles(columns, width, gutter, 0))
    .map(extractDimensions)

  const returnedPattern = LayoutEngine.generateRectangles({
    dimensions,
    collapsing,
    gutter,
    width,
    columns
  })

  // sort the returned values by x, y coordinates (left to right, top to bottom)
  // if the order IS maintained, before and after sorting should remain the same (if collapsing is disabled)
  // if the order IS NOT maintained, before and after sorting could differ
  const controlPattern = returnedPattern
    .sort((rectangle1, rectangle2) => {
      if (rectangle1.y < rectangle2.y) {
        return -1
      }

      if (rectangle1.y > rectangle2.y) {
        return 1
      }

      if (rectangle1.x < rectangle2.x) {
        return -1
      }

      if (rectangle1.x > rectangle2.x) {
        return 1
      }

      return 0
    })
    .map(extractDimensions)

  // If order is maintained, these two values should be identical
  t.deepEqual(expectedPattern, controlPattern)

})