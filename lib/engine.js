var LayoutEngine = {}

LayoutEngine.generateRectangles = function (options) {

  if (!options.dimensions) throw new Error('No dimensions option given for Masonry Layout')

  options.gutter = options.gutter || 0
  options.gutterX = options.gutterX || options.gutter 
  options.gutterY = options.gutterY || options.gutter
  options.width = options.width || 800

  return options.dimensions
    .map(LayoutEngine.__scaleRectangles(options.columns, options.width, options.gutterX))
    .map(LayoutEngine.__translateRectanglesForNColumns(options.columns, options.width, options.gutterX, options.gutterY))
}

LayoutEngine.__translateRectanglesForNColumns = function (numColumns, totalWidth, gutterX, gutterY) {
  /* Translate rectangles into position */

  return function (rectangle, i, allRects) {
    if (!i) {
      // first round
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, 0, 0, gutterY)
      return rectangle
    } else if (i < numColumns) {
      // first row
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, LayoutEngine.__widthSingleColumn(numColumns, totalWidth, gutterX) * i + gutterX * i, 0, gutterY)
      rectangle.flagged = false
      return rectangle
    } else {
      // place rects
      var placeAfter = LayoutEngine.__placeAfterRectangle(allRects)
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, placeAfter.x, (placeAfter.height + placeAfter.y), gutterY)
      placeAfter.flagged = true
      return rectangle
    }
  }
}

/* Scale all rectangles to fit into a single column */
LayoutEngine.__scaleRectangles = function (numColumns, totalWidth, gutterX) {
  return function (rectangle) {
    var w = rectangle.width
    var h = rectangle.height
    
    var factor = w / h
    var width = LayoutEngine.__widthSingleColumn(numColumns, totalWidth, gutterX)
    var height = width / factor

    return {
      width: Math.floor(width),
      height: Math.floor(height),
      x: 0,
      y: 0,
      flagged: true,
    }  
  }
}

LayoutEngine.__placeRectangleAt = function (rectangle, x, y, gutterY) {
  if (y) y += gutterY

  return Object.assign(rectangle, {x: x, y: y, flagged: false})
}

/* Takes in a group of Rectangles and return the 'leading' rectangle */
LayoutEngine.__placeAfterRectangle = function (rectArray) {
  return rectArray
    .filter(function(r) {
      return !(r.flagged)
    })
    .reverse()
    .reduce(function(prev, curr) {
      if (prev) {
        if (prev.height + prev.y < curr.height + curr.y) return prev
      }
      return curr
    })
}

LayoutEngine.__widthSingleColumn = function (numColumns, totalWidth, gutter) {
  return (totalWidth / numColumns) - gutter
}

if (typeof module === 'object' && module.exports) {
  module.exports = LayoutEngine
} else {
  window.LayoutEngine = LayoutEngine
}
