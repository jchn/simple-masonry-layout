var LayoutEngine = {}

LayoutEngine.generateRectangles = function (rectArray, numColumns, totalWidth) {
  return rectArray
    .map(scaleRectangles(numColumns, totalWidth))
    .map(translateRectanglesForNColumns(numColumns, totalWidth))
}

function translateRectanglesForNColumns(numColumns, totalWidth) {
  /* Translate rectangles into position */

  return function (rectangle, i, allRects) {
    if (!i) {
      // first round
      rectangle = placeRectangleAt(rectangle, 0, 0)
      return rectangle
    } else if (i < numColumns) {

      // first row
      rectangle = placeRectangleAt(rectangle, widthSingleColumn(numColumns, totalWidth) * i, 0)
      rectangle.flagged = false
      return rectangle
    } else {
      // place rects
      var placeAfter = placeAfterRectangle(allRects)
      rectangle = placeRectangleAt(rectangle, placeAfter.x, (placeAfter.height + placeAfter.y))
      placeAfter.flagged = true
      return rectangle
    }
  }
}

/* Scale all rectangles to fit into a single column */
function scaleRectangles (numColumns, totalWidth) {
  return function (rectangle) {
    var w = rectangle.width
    var h = rectangle.height
    
    var factor = w / h
    var width = widthSingleColumn(numColumns, totalWidth)
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

function placeRectangleAt (rectangle, x, y) {
  return Object.assign(rectangle, {x, y, flagged: false})
}

/* Takes in a group of Rectangles and return the 'leading' rectangle */
function placeAfterRectangle (rectArray) {
  return rectArray
    .filter(function(r) {
      return !(r.flagged)
    })
    .reduce(function(prev, curr) {
      if (prev) {
        if (prev.height + prev.y < curr.height + curr.y) return prev
      }
      return curr
    })
}

function widthSingleColumn (numColumns, totalWidth) {
  return totalWidth / numColumns
}

if (typeof module === 'object' && module.exports) {
  module.exports = LayoutEngine
} else {
  window.LayoutEngine = LayoutEngine
}
