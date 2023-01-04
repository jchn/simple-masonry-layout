/**
 * A rectangle indicating a position and width/height properties
 * to be presented on screen.
 */
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * A size used by SimpleMasonryLayout to determine the aspect ratio of an item.
 */
export type Size = {
  width: number;
  height: number;
};

/**
 * Options to customize the layout.
 */
export type Options = {
  gutter?: number;
  gutterX?: number;
  gutterY?: number;
  maxHeight?: number;
  collapsing?: boolean;
  centering?: boolean;
  paddingY?: number;
};

type RequiredOptions = Required<Options>;

export function generate(
  sizes: Size[],
  width: number,
  columns: number,
  options: Options
): Rect[] {
  const scaleRectangleOptions: ScaleRectangleOptions = {
    columns,
    width,
    gutterX: options.gutterX ?? options.gutter,
  };

  const translateRectanglesForNColumnsOptions: TranslateRectanglesForNColumnsOptions =
    {
      columns,
      width,
      gutterX: options.gutterX ?? options.gutter,
      gutterY: options.gutterY ?? options.gutter,
      collapsing: options.collapsing,
    };

  const centerRectanglesOptions: CenterRectanglesOptions = {
    columns,
    width,
    centering: options.centering,
    gutterX: options.gutterX ?? options.gutter,
  };

  return sizes
    .map(toRectangle)
    .map(scaleRectangle.bind(null, scaleRectangleOptions))
    .map(padYRectangle.bind(null, options.paddingY ?? 0))
    .map(
      translateRectanglesForNColumns.bind(
        null,
        translateRectanglesForNColumnsOptions
      )
    )
    .map(centerRectangles.bind(null, centerRectanglesOptions));
}

export function toRectangle(size: Size): Rect {
  return { x: 0, y: 0, ...size };
}

function padYRectangle(amount: number, rectangle: Rect): Rect {
  return { ...rectangle, height: rectangle.height + amount };
}

type ScaleRectangleOptions = {
  columns: number;
  width: number;
  gutterX?: number;
  maxHeight?: number;
};

/* Scale all rectangles to fit into a single column */
export function scaleRectangle(
  { columns, width: totalWidth, gutterX = 0, maxHeight }: ScaleRectangleOptions,
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
    width: width,
    height: height,
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
    rectangle: Rect
  ) {
    if (!~values.findIndex(findValue(rectangle.x))) {
      values.push(rectangle.x);
    }
    return values;
  },
  []);

  const columns = rectArray.reduce(function (
    rectangles: Rect[],
    rectangle: Rect
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

type TranslateRectanglesForNColumnsOptions = {
  columns: number;
  width: number;
  gutterX?: number;
  gutterY?: number;
  collapsing?: boolean;
};

/* Translate rectangles into position */
export function translateRectanglesForNColumns(
  options: TranslateRectanglesForNColumnsOptions,
  rectangle: Rect,
  i: number,
  rectangles: Rect[]
): Rect {
  const {
    columns,
    width,
    gutterX = 0,
    gutterY = 0,
    collapsing = true,
  } = options;

  let placeAfter: Rect;

  if (!i) {
    // first round
    rectangle = placeRectangleAt(rectangle, 0, 0);
    return rectangle;
  } else if (i < columns) {
    // first row
    rectangle = placeRectangleAt(
      rectangle,
      widthSingleColumn(columns, width, gutterX) * i + gutterX * i,
      0
    );
    return rectangle;
  } else {
    // Pass array of all previous rectangles, give back leading rectangle
    if (collapsing) {
      placeAfter = placeAfterRectangle(
        rectangles.slice(0, i),
        gutterY,
        collapsing,
        columns,
        i
      );
    } else {
      // only use the rectangles from te previous row
      placeAfter = placeAfterRectangle(
        rectangles.slice(0, i - (i % columns)),
        gutterY,
        collapsing,
        columns,
        i
      );
    }
    rectangle = placeRectangleAt(rectangle, placeAfter.x, placeAfter.height);
    return rectangle;
  }
}

type CenterRectanglesOptions = {
  columns: number;
  width: number;
  centering?: boolean;
  gutterX?: number;
};

export function centerRectangles(
  { columns, width, centering = false, gutterX = 0 }: CenterRectanglesOptions,
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
