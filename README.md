# simple-masonry-layout
Calculating masonry layouts based on rectangles, without being tied to the DOM.

## Installation

`npm install simple-masonry-layout`

## Getting started

###### Importing

es6
`import SimpleMasonry from 'simple-masonry-layout'`

es5
`var SimpleMasonry = require('simple-masonry-layout')`

###### Browser global

When including simple-masonry.js inside of a `<script>` tag, `SimpleMasonry` will be attached to the window object.

### Generating rectangles

SimpleMasonry only has a single public method: `generateRectangles(options)`

The only thing this method does is generate an array of rectangle objects which look like this:

  ```
    [{
      width: <number>,
      height: <number>,
      x: <number>,
      y: <number>
    }]
  ```

These rectangles will form your layout, it is up to you to render them on screen.

To do this `generateRectangles` will need you to give it an object with the following properties:

##### dimensions - Array

An array consisting of 'dimension' objects, which looks like this:

  ```
  [{
    width: <number>,
    height: <number>
  }]
  ```

The dimensions will be scaled proportionately so they'll fit inside of the columns.

##### columns - number (default: 3)

The number of columns you'd like to have.

##### width - number (default: 800)

The total width the layout should fill up.

##### gutter - number (default: 0)

The size of the gutters you'd like to have between elements.

##### gutterX - number (default: value of gutter)

The vertical gutter between elements.

##### gutterY - number (default: value of gutter)

The horizontal gutter between elements.

## Code example

  ```
  import SimpleMasonry from 'simple-masonry-layout'

  // These values could come from anywhere, an api, measuring images in the browser etc.
  const dimensions = [{
    width: 500,
    height: 800
  }, {
    width: 900,
    height: 1000
  },
  ...
  ]

  const rectangles = SimpleMasonry.generateRectangles({
    dimensions,
    columns: 5,
    width: 1920,
    gutter: 20
  })

  // Now do something with the rectangles to render the layout
  ```

For a more detailed example please check out the examples directory.

## React component

If you'd like to use it with react, please check out [react-simple-masonry](https://github.com/awkward/react-simple-masonry).