import React, { ReactNode } from "react";
import {
  getLayout,
  Options,
  GridItem,
  Item,
} from "@jchn/simple-masonry-layout";

interface KeyHolder {
  key: string;
}

type MasonryGridProps<T extends KeyHolder> =
  React.HTMLAttributes<HTMLDivElement> & {
    items: Item<T>[];
    width: number;
    columns?: number;
    options?: Options;
    renderItem: (props: GridItem<T>) => ReactNode;
    divAttrs?: React.HTMLAttributes<HTMLDivElement>;
  };

function MasonryGrid<T extends KeyHolder>({
  items,
  width,
  columns = 3,
  options,
  renderItem,
  ...divAttrs
}: MasonryGridProps<T>) {
  const layout = getLayout(items, width, columns, options);

  const gridItems = layout.items;

  return (
    <div {...divAttrs} style={{ height: layout.height, ...divAttrs?.style }}>
      {gridItems.map((item) => (
        <React.Fragment key={item.data.key}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
}

export default MasonryGrid;
