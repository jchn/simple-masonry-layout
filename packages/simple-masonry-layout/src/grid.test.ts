import test from "ava";
import { getLayout, Rect, Size, Item } from "./grid";

function extractSize(rectangle: Rect): Size {
  return {
    width: rectangle.width,
    height: rectangle.height,
  };
}

test("x and y gutter should be separately configurable", (t) => {
  const sizes: Size[] = [];

  const gutterX = 50;
  const gutterY = 30;

  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });
  sizes.push({ width: 800, height: 800 });

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const layout = getLayout(items, 800, 2, {
    gutterX,
    gutterY,
  });

  t.is(
    800 - (layout.items[0].rect.width + layout.items[1].rect.width),
    gutterX,
    "GutterX is reflected in the grid"
  );
  t.is(
    layout.items[2].rect.y - layout.items[0].rect.height,
    gutterY,
    "GutterY is reflected in the grid"
  );
});

test("Max height should be configurable", (t) => {
  const sizes: Size[] = [];

  const maxHeight = 800;
  const width = 8000;

  for (let i = 0; i < 20; i++) {
    sizes.push({ width: 2500, height: 2500 });
  }

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const layout = getLayout(items, 3, width, {
    maxHeight,
  });

  t.true(
    layout.items.every((i) => i.rect.height <= maxHeight),
    "All items aren't any bigger than max height"
  );
});

test("Collapsing should affect the grid", (t) => {
  const sizes: Size[] = [];

  for (let i = 0; i < 20; i++) {
    sizes.push({
      width: Math.random() * 100 + 100,
      height: Math.random() * 100 + 100,
    });
  }

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const gridItems1 = getLayout(items, 800, 3, {
    collapsing: true,
  });

  const gridItems2 = getLayout(items, 800, 3, {
    collapsing: false,
  });

  t.notDeepEqual(gridItems1, gridItems2);
});

test("Layout order should be maintained", (t) => {
  const sizes: Size[] = [
    { width: 500, height: 1 },
    { width: 500, height: 2 },
    { width: 500, height: 3 },
  ];

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const layout = getLayout(items, 1000, 2, { gutter: 0, collapsing: false });

  t.deepEqual(
    layout.items.map((i) => i.rect.height),
    [1, 2, 3]
  );
});

test("The centering option should center the colums when there are less blocks than number of columns", (t) => {
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

  const sizes = expectedPattern.map(extractSize);

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const returnedPattern = getLayout(items, width, columns, {
    gutter,
    centering,
  }).items.map((i) => i.rect);

  t.deepEqual(expectedPattern, returnedPattern);
});

test("PaddingY should add a fixed amount of height to each rectangle", (t) => {
  const paddingY = 200;
  const width = 800;

  const sizes: Size[] = [
    {
      width: 150,
      height: 150,
    },
  ];

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const layout = getLayout(items, 800, 1, { paddingY: 200 });

  t.is(
    layout.items[0].rect.height,
    width + paddingY,
    "PaddingY is added to the size of a rectangle"
  );
});

test("Generating 1000 rectangles should take less time than 16ms", (t) => {
  const sizes: Size[] = Array(1000)
    .fill(null)
    .map(() => ({
      width: Math.random() * 150,
      height: Math.random() * 150,
    }));

  const start = process.hrtime();

  const items: Item<null>[] = sizes.map((s) => ({ data: null, size: s }));

  const _ = getLayout(items, 800, 3, {});

  const elapsed = process.hrtime(start);
  const ms = elapsed[0] * 1000 + elapsed[1] / 1000000;

  t.assert(ms <= 16, `Grid is generated in a reasonable time, it took ${ms}ms`);
});
