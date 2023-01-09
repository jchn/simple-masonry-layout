interface Col<T> {
  readonly items: GridItem<T>[];
  readonly width: number;
  readonly height: number;
  readonly length: number;
  readonly last: GridItem<T> | null;

  insert(item: Item<T>, at?: number): void;
}

interface ColGroup<T> {
  readonly shortest: Col<T> | null;
  readonly longest: Col<T> | null;
  readonly cols: Col<T>[];
  readonly items: GridItem<T>[];

  insert(col: Col<T>): void;
}

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

export type Item<T> = {
  size: Size;
  data: T;
};

export type GridItem<T> = {
  rect: Rect;
  data: T;
};

export type Layout<T> = {
  items: GridItem<T>[];
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

class MasonryColumnGroup<T> implements ColGroup<T> {
  private _cols: Col<T>[];

  get shortest(): Col<T> | null {
    if (this._cols.length === 0) {
      return null;
    }

    return this._cols.slice().sort((a, b) => a.height - b.height)[0];
  }

  get longest(): Col<T> | null {
    if (this._cols.length === 0) {
      return null;
    }

    return this._cols.slice().sort((a, b) => b.height - a.height)[0];
  }

  get cols() {
    return this._cols;
  }

  get items() {
    const items = this.cols.map((c) => c.items).flat();

    return items.sort((a, b) => {
      return a.rect.y - b.rect.y;
    });
  }

  constructor() {
    this._cols = [];
  }

  insert(col: Col<T>) {
    this._cols.push(col);
  }
}

class MasonryColumn<T> implements Col<T> {
  private _width: number;
  private _options: Options;
  private _x: number;
  private _items: GridItem<T>[];

  get width(): number {
    return this._width;
  }

  get height(): number {
    const last = this.last;

    if (last === null) {
      return 0;
    }

    return last.rect.height + last.rect.y;
  }

  get items(): GridItem<T>[] {
    return this._items;
  }

  get length(): number {
    return this.items.length;
  }

  get gutterY(): number {
    return this._options.gutterY ?? this._options.gutter ?? 0;
  }

  get last(): GridItem<T> | null {
    if (this._items.length === 0) {
      return null;
    }

    return this._items[this._items.length - 1];
  }

  private get bottom(): number {
    if (this.height === 0) {
      return 0;
    }

    return this.height + this.gutterY;
  }

  constructor(x: number, width: number, options: Options) {
    this._x = x;
    this._width = width;
    this._options = options;
    this._items = [];
  }

  insert(item: Item<T>, at?: number) {
    const rectangle: Rect = {
      x: this._x,
      y: at ?? this.bottom,
      width: item.size.width,
      height: item.size.height,
    };

    if (item.size.width !== this.width) {
      // scale rectangle
      rectangle.height = rectangle.height * (this.width / rectangle.width);
      rectangle.width = this.width;
    }

    if (this._options.maxHeight && this._options.maxHeight < rectangle.height) {
      rectangle.height = this._options.maxHeight;
    }

    if (this._options.paddingY) {
      rectangle.height += this._options.paddingY;
    }

    this._items.push({ data: item.data, rect: rectangle });
  }
}

export function getLayout<T>(
  items: Item<T>[],
  width: number,
  columns: number,
  options: Options
): Layout<T> {
  if (options.collapsing === undefined) {
    options.collapsing = true;
  }

  const gutterX = options.gutterX ?? options.gutter ?? 0;
  const gutterY = options.gutterY ?? options.gutter ?? 0;

  const group = new MasonryColumnGroup<T>();

  const colWidth = widthSingleColumn(columns, width, gutterX);

  for (let i = 0; i < columns; i++) {
    let x: number = i * colWidth + gutterX * i;

    if (options.centering && items.length < columns) {
      // Shift columns to center
      const numColsToShift = (columns - items.length) / 2;

      x += numColsToShift * colWidth;
    }

    const col = new MasonryColumn<T>(x, colWidth, options);
    group.insert(col);
  }

  if (options.collapsing) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      group.shortest?.insert(item);
    }

    return {
      items: group.items,
      height: group.longest?.height ?? 0,
    };
  } else {
    let y = 0;
    const gridItems: GridItem<T>[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i % group.cols.length === 0) {
        y = group.longest?.height ?? 0;
        if (y > 0) {
          y += gutterY;
        }
      }

      const col = group.cols[i % group.cols.length];

      col.insert(item, y);

      gridItems.push(col.last!);
    }

    return {
      items: gridItems,
      height: group.longest?.height ?? 0,
    };
  }
}

function widthSingleColumn(
  columns: number,
  width: number,
  gutter: number
): number {
  width += gutter;

  return width / columns - gutter;
}
