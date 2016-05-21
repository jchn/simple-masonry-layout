var LayoutEngine = {}

LayoutEngine.generateRectangles = function (options) {

  if (!options.dimensions) throw new Error('No dimensions option given for Masonry Layout')

  options.gutter = options.gutter || 0
  options.gutterX = options.gutterX || options.gutter 
  options.gutterY = options.gutterY || options.gutter
  options.width = options.width || 800
  options.columns = options.columns || 3
  options.maxHeight = options.maxHeight || 0

  if (typeof options.collapsing === 'undefined') {
    options.collapsing = true
  }

  if (typeof options.centering === 'undefined') {
    options.centering = false
  }

  return options.dimensions
    .map(LayoutEngine.__scaleRectangles(options.columns, options.width, options.gutterX, options.maxHeight))
    .map(LayoutEngine.__translateRectanglesForNColumns(options.columns, options.width, options.gutterX, options.gutterY, options.collapsing))
    .map(LayoutEngine.__centerRectangles(options.centering, options.columns, options.width, options.gutterX))
}

LayoutEngine.__translateRectanglesForNColumns = function (numColumns, totalWidth, gutterX, gutterY, collapsing, centering) {
  /* Translate rectangles into position */

  return function (rectangle, i, allRects) {
    if (!i) {
      // first round
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, 0, 0, gutterY)
      return rectangle
    } else if (i < numColumns) {
      // first row
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, (LayoutEngine.__widthSingleColumn(numColumns, totalWidth, gutterX) * i) + (gutterX * i), 0)
      return rectangle
    } else {
      // Pass array of all previous rectangles, give back leading rectangle
      if (collapsing) {
        var placeAfter = LayoutEngine.__placeAfterRectangle(allRects.slice(0, i), gutterY, collapsing, numColumns, i)
      } else {
        // only use the rectangles from te previous row
        var placeAfter = LayoutEngine.__placeAfterRectangle(allRects.slice(0, i - i % numColumns), gutterY, collapsing, numColumns, i)
      }
      rectangle = LayoutEngine.__placeRectangleAt(rectangle, placeAfter.x, (placeAfter.height))
      return rectangle
    }
  }
}

/* Scale all rectangles to fit into a single column */
LayoutEngine.__scaleRectangles = function (numColumns, totalWidth, gutterX, maxHeight) {
  return function (rectangle) {
    var w = rectangle.width
    var h = rectangle.height
    
    var factor = w / h
    var width = LayoutEngine.__widthSingleColumn(numColumns, totalWidth, gutterX)
    var height = width / factor

    // Set max height
    if (maxHeight && maxHeight < height) {
      height = maxHeight
    }

    return {
      width: Math.floor(width),
      height: Math.floor(height),
      x: 0,
      y: 0
    }
  }
}

LayoutEngine.__centerRectangles = function (centering, columns, width, gutterX) {
  var widthSingleColumn = LayoutEngine.__widthSingleColumn(columns, width, gutterX)
  return function (rectangle, i, allRects) {
    if (columns <= allRects.length || !centering) {
      // No need to center anything
      return rectangle
    } else {
      // Shift each rectangle
      rectangle.x += ((columns - allRects.length) * widthSingleColumn / 2) + ((columns - allRects.length) * gutterX / 2)
      return rectangle
    }
  }
}

LayoutEngine.__placeRectangleAt = function (rectangle, x, y) {
  return Object.assign(rectangle, {x: x, y: y})
}

LayoutEngine.__rectanglesToColumns = function (rectArray, gutterY) {
  // reduce rectangles into larger column sized rectangles

  function findValue (match) {
    return function (value) {
      return (value === match)
    }
  }

  var xValues = rectArray
    .reduce(function (values, rectangle, i, array) {
      if (!~values.findIndex(findValue(rectangle.x))) {
        values.push(rectangle.x)
      }
      return values
    }, [])

  var columns = rectArray
    .reduce(function (rectangles, rectangle, i, array) {

      var index = xValues.findIndex(findValue(rectangle.x))

      if (rectangles[index]) {
        rectangles[index]['height'] = rectangle.y + rectangle.height + gutterY
      } else {
        // start new column
        rectangles[index] = Object.assign({}, rectangle)
        rectangles[index]['height'] += gutterY
      }

      return rectangles

    }, [])

  return columns
}

LayoutEngine.__placeAfterRectangle = function (rectArray, gutterY, collapsing, numColumns, index) {

  var columns = LayoutEngine.__rectanglesToColumns(rectArray, gutterY)

  var columnsByHeightAsc = columns.sort(function (columnA, columnB) {
    return columnA.height - columnB.height
  }).map(function (r) {
    return Object.assign({}, r)
  })

  var columnsByHeightDesc = columns.sort(function (columnA, columnB) {
    return columnB.height - columnA.height
  }).map(function (r) {
    return Object.assign({}, r)
  })

  var columnsByXDesc = columns.sort(function (columnA, columnB) {
    return columnA.x - columnB.x
  }).map(function (r) {
    return Object.assign({}, r)
  })

  if (collapsing) {
    // return the smallest column
    return columnsByHeightAsc[0]
  } else {
    return {
      x: columns[(index % numColumns)]['x'],
      y: 0,
      width: columnsByHeightDesc[(index % numColumns)]['width'],
      height: columnsByHeightDesc[0]['height']
    }
  }
}

LayoutEngine.__widthSingleColumn = function (numColumns, totalWidth, gutter) {
  totalWidth += gutter

  return (totalWidth / numColumns) - gutter
}

if (typeof module === 'object' && module.exports) {
  module.exports = LayoutEngine
} else {
  window.SimpleMasonry = LayoutEngine
}
