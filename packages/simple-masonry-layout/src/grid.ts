export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Size = {
  width: number;
  height: number;
};

export type CustomizeFn = (
  options: SimpleMasonryLayoutOptions,
  rectangle: Rect,
  index: number,
  rectangles: Rect[]
) => Rect;

export type SimpleMasonryLayoutOptions = {
  sizes: Size[];
  columns: number;
  width: number;
  gutter?: number;
  gutterX?: number;
  gutterY?: number;
  maxHeight?: number;
  collapsing?: boolean;
  centering?: boolean;
  customize?: CustomizeFn;
};

type RequiredOptions = Required<SimpleMasonryLayoutOptions>;

export function generate(options: SimpleMasonryLayoutOptions): Rect[] {
  const allOptions: RequiredOptions = {
    sizes: options.sizes ?? [],
    gutter: options.gutter || 0,
    gutterX: options.gutterX ?? options.gutter ?? 0,
    gutterY: options.gutterY ?? options.gutter ?? 0,
    width: options.width,
    columns: options.columns,
    maxHeight: options.maxHeight ?? 0,
    customize:
      options.customize ??
      ((
        options: SimpleMasonryLayoutOptions,
        r: Rect,
        index: number,
        rectangles: Rect[]
      ) => r),
    collapsing: options.collapsing ?? true,
    centering: options.centering ?? false,
  };

  return allOptions.sizes
    .map(toRectangle)
    .map(scaleRectangle.bind(null, allOptions))
    .map(allOptions.customize.bind(null, allOptions))
    .map(translateRectanglesForNColumns.bind(null, allOptions))
    .map(centerRectangles.bind(null, allOptions));
}

export function toRectangle(size: Size): Rect {
  return { x: 0, y: 0, ...size };
}

type ScaleRectangleOptions = Pick<
  RequiredOptions,
  "columns" | "width" | "gutterX" | "maxHeight"
>;

/* Scale all rectangles to fit into a single column */
export function scaleRectangle(
  { columns, width: totalWidth, gutterX, maxHeight }: ScaleRectangleOptions,
  rectangle: Rect
): Rect {
  const w = rectangle.width;
  const h = rectangle.height;

  const factor = w / h;
  const width = widthSingleColumn(columns, totalWidth, gutterX);
  let height = width / factor;

  // Set max height
  if (maxHeight && maxHeight < height) {
    height = maxHeight;
  }

  return {
    x: rectangle.x,
    y: rectangle.y,
    width: Math.floor(width),
    height: Math.floor(height),
  };
}

/* transforms rectangles into larger column sized rectangles */
export function rectanglesToColumns(
  rectArray: Rect[],
  gutterY: number
): Rect[] {
  function findValue(match: number) {
    return function (value: number) {
      return value === match;
    };
  }

  const xValues = rectArray.reduce(function (
    values: number[],
    rectangle: Rect,
    i: number,
    array: Rect[]
  ) {
    if (!~values.findIndex(findValue(rectangle.x))) {
      values.push(rectangle.x);
    }
    return values;
  },
  []);

  const columns = rectArray.reduce(function (
    rectangles: Rect[],
    rectangle: Rect,
    i: number,
    array: Rect[]
  ) {
    const index = xValues.findIndex(findValue(rectangle.x));

    if (rectangles[index]) {
      rectangles[index]["height"] = rectangle.y + rectangle.height + gutterY;
    } else {
      // start new column
      rectangles[index] = Object.assign({}, rectangle);
      rectangles[index]["height"] += gutterY;
    }

    return rectangles;
  },
  []);

  return columns;
}

export function widthSingleColumn(
  numColumns: number,
  totalWidth: number,
  gutter: number
): number {
  totalWidth += gutter;

  return totalWidth / numColumns - gutter;
}

export function placeRectangleAt(rectangle: Rect, x: number, y: number): Rect {
  return Object.assign(rectangle, { x: x, y: y });
}

export function placeAfterRectangle(
  rectArray: Rect[],
  gutterY: number,
  collapsing: boolean,
  numColumns: number,
  index: number
) {
  const columns = rectanglesToColumns(rectArray, gutterY);

  const columnsByHeightAsc = columns
    .sort(function (columnA, columnB) {
      return columnA.height - columnB.height;
    })
    .map(function (r) {
      return Object.assign({}, r);
    });

  const columnsByHeightDesc = columns
    .sort(function (columnA, columnB) {
      return columnB.height - columnA.height;
    })
    .map(function (r) {
      return Object.assign({}, r);
    });

  const columnsByXDesc = columns
    .sort(function (columnA, columnB) {
      return columnA.x - columnB.x;
    })
    .map(function (r) {
      return Object.assign({}, r);
    });

  if (collapsing) {
    // return the smallest column
    return columnsByHeightAsc[0];
  } else {
    return {
      x: columns[index % numColumns]["x"],
      y: 0,
      width: columnsByHeightDesc[index % numColumns]["width"],
      height: columnsByHeightDesc[0]["height"],
    };
  }
}

/* Translate rectangles into position */
export function translateRectanglesForNColumns(
  options: RequiredOptions,
  rectangle: Rect,
  i: number,
  rectangles: Rect[]
): Rect {
  let placeAfter: Rect;

  if (!i) {
    // first round
    rectangle = placeRectangleAt(rectangle, 0, 0);
    return rectangle;
  } else if (i < options.columns) {
    // first row
    rectangle = placeRectangleAt(
      rectangle,
      widthSingleColumn(options.columns, options.width, options.gutterX) * i +
        options.gutterX * i,
      0
    );
    return rectangle;
  } else {
    // Pass array of all previous rectangles, give back leading rectangle
    if (options.collapsing) {
      placeAfter = placeAfterRectangle(
        rectangles.slice(0, i),
        options.gutterY,
        options.collapsing,
        options.columns,
        i
      );
    } else {
      // only use the rectangles from te previous row
      placeAfter = placeAfterRectangle(
        rectangles.slice(0, i - (i % options.columns)),
        options.gutterY,
        options.collapsing,
        options.columns,
        i
      );
    }
    rectangle = placeRectangleAt(rectangle, placeAfter.x, placeAfter.height);
    return rectangle;
  }
}

type CenterRectanglesOptions = Pick<
  RequiredOptions,
  "centering" | "columns" | "width" | "gutterX"
>;

export function centerRectangles(
  { centering, columns, width, gutterX }: CenterRectanglesOptions,
  rectangle: Rect,
  i: number,
  rectangles: Rect[]
) {
  const wSingleColumn = widthSingleColumn(columns, width, gutterX);
  if (columns <= rectangles.length || !centering) {
    // No need to center anything
    return rectangle;
  } else {
    // Shift each rectangle
    rectangle.x +=
      ((columns - rectangles.length) * wSingleColumn) / 2 +
      ((columns - rectangles.length) * gutterX) / 2;
    return rectangle;
  }
}
