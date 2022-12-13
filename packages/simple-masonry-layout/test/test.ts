import test from "ava";
import {
  CustomizeFn,
  generate,
  Rect,
  scaleRectangle,
  Size,
  toRectangle,
} from "../src/grid";

function extractSize(rectangle: Rect): Size {
  return {
    width: rectangle.width,
    height: rectangle.height,
  };
}

type OrderedSize = Size & { order: number };

test("layout order should be maintained when dimensions are the same", (t) => {
  const sizes: OrderedSize[] = [];

  for (let i = 0; i < 20; i++) {
    sizes.push({ width: 500, height: 500, order: i });
  }

  const rectangles = generate({
    sizes,
    columns: 5,
    width: 2500,
    gutter: 0,
  });

  const expectedPattern = [];
  for (let i = 0; i < 20; i++) {
    expectedPattern.push({
      x: (i * 500) % 2500,
      y: Math.floor(i / 5) * 500,
    });
  }

  const returnedPattern = rectangles.map((rectangle) => ({
    x: rectangle.x,
    y: rectangle.y,
  }));

  t.deepEqual(returnedPattern, expectedPattern);
});

test("x and y gutter should be separately configurable", (t) => {
  const sizes = [];

  const gutterX = 50;
  const gutterY = 30;

  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });

  const rectangles = generate({
    sizes,
    columns: 2,
    width: 800,
    gutterX: gutterX,
    gutterY: gutterY,
  });

  const expectedPattern = [
    {
      x: 0,
      y: 0,
    },
    {
      x: 425,
      y: 0,
    },
    {
      x: 0,
      y: 405,
    },
    {
      x: 425,
      y: 405,
    },
  ];

  const returnedPattern = rectangles.map((rectangle) => ({
    x: rectangle.x,
    y: rectangle.y,
  }));

  t.deepEqual(returnedPattern, expectedPattern);
});

test("max height should be configurable", (t) => {
  const sizes = [];

  const maxHeight = 800;
  const width = 8000;

  for (let i = 0; i < 20; i++) {
    sizes.push({ width: 2500, height: 2500 });
  }

  const rectangles = generate({
    sizes,
    columns: 3,
    maxHeight,
    width,
  });

  t.true(rectangles.every((r) => r.height <= maxHeight));
});

test("collapsing should be optional", (t) => {
  const sizes = [];

  for (let i = 0; i < 20; i++) {
    sizes.push({
      width: Math.random() * 100 + 100,
      height: Math.random() * 100 + 100,
    });
  }

  const rectangles1 = generate({
    sizes,
    columns: 3,
    width: 800,
    collapsing: true,
  });

  const rectangles2 = generate({
    sizes,
    collapsing: false,
    width: 800,
    columns: 3,
  });

  t.notDeepEqual(rectangles1, rectangles2);
});

test("layout order should be maintained when collapsing is turned off", (t) => {
  const sizes = [];
  const columns = 5;
  const width = 1000;
  const collapsing = true;
  const gutter = 0;

  for (let i = 1; i < 20; i++) {
    sizes.push({
      width: i * 50 + 100,
      height: i * 50 + 100 + (i % 3) * 50,
    });
  }

  // we expect to get back the scaled sizes in the same order as they were entered
  const expectedPattern = sizes
    .map((r) =>
      scaleRectangle(
        { columns, width, gutterX: gutter, maxHeight: 0 },
        toRectangle(r)
      )
    )
    .map(extractSize);

  const returnedPattern = generate({
    sizes,
    collapsing,
    gutter,
    width,
    columns,
  });

  // sort the returned values by x, y coordinates (left to right, top to bottom)
  // if the order IS maintained, before and after sorting should remain the same (if collapsing is disabled)
  // if the order IS NOT maintained, before and after sorting could differ
  const controlPattern = returnedPattern
    .sort((rectangle1, rectangle2) => {
      if (rectangle1.y < rectangle2.y) {
        return -1;
      }

      if (rectangle1.y > rectangle2.y) {
        return 1;
      }

      if (rectangle1.x < rectangle2.x) {
        return -1;
      }

      if (rectangle1.x > rectangle2.x) {
        return 1;
      }

      return 0;
    })
    .map(extractSize);

  // If order is maintained, these two values should be identical
  t.deepEqual(expectedPattern, controlPattern);
});

test("the centering option should center the colums when there are less blocks than number of columns", (t) => {
  let sizes = [];
  const columns = 3;
  const width = 600;
  const gutter = 0;
  const centering = true;

  const expectedPattern = [
    {
      x: 100,
      y: 0,
      width: 200,
      height: 200,
    },
    {
      x: 300,
      y: 0,
      width: 200,
      height: 200,
    },
  ];

  sizes = expectedPattern.map(extractSize);

  const returnedPattern = generate({
    sizes,
    gutter,
    width,
    columns,
    centering,
  });

  t.deepEqual(expectedPattern, returnedPattern);
});

test("the customize option callback should be provided with the original options", (t) => {
  const sizes = [
    { width: 50, height: 50 },
    { width: 20, height: 20 },
  ];
  const columns = 3;
  const width = 600;
  const gutterX = 20;
  const gutterY = 20;
  const gutter = 20;
  const centering = false;
  const maxHeight = 500;
  const collapsing = true;

  let returnedOptions = {};
  const customize: CustomizeFn = (options, rectangle) => {
    returnedOptions = options;
    return rectangle;
  };

  const expectedOptions = {
    sizes,
    gutter,
    gutterX,
    gutterY,
    width,
    columns,
    customize,
    maxHeight,
    collapsing,
    centering,
  };

  generate({
    sizes,
    gutter,
    gutterX,
    gutterY,
    width,
    columns,
    customize,
    maxHeight,
    collapsing,
    centering,
  });

  t.deepEqual(expectedOptions, returnedOptions);
});
