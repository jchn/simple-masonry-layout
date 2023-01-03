import React, { ReactNode } from "react";
import {
  generate,
  SimpleMasonryLayoutOptions,
  Rect,
  Size,
} from "simple-masonry-layout";

type MasonryGridItem<T> = {
  size: Size;
  key: string;
  data: T;
};

type CalculatedMasonryGridItem<T> = MasonryGridItem<T> & { rectangle: Rect };

type MasonryGridProps<T> = Omit<SimpleMasonryLayoutOptions, "sizes"> & {
  items: MasonryGridItem<T>[];
  renderContent: (props: CalculatedMasonryGridItem<T>) => ReactNode;
};

export const MasonryGridItem: React.FC<{
  rectangle: Rect;
  children: ReactNode;
}> = (props) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translate(${props.rectangle.x}px, ${props.rectangle.y})`,
    }}
  >
    {props.children}
  </div>
);

// Probably doesn't even need to render a div
function MasonryGrid<T>(props: MasonryGridProps<T>) {
  const rectangles = generate({
    ...props,
    sizes: props.items.map((i) => i.size),
  });

  if (rectangles.length == 0) return null;

  return (
    <div
      style={{
        height:
          rectangles[rectangles.length - 1].height +
          rectangles[rectangles.length - 1].y,
      }}
    >
      {rectangles.map((r, index) => (
        <React.Fragment key={props.items[index].key}>
          {props.renderContent({ ...props.items[index], rectangle: r })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default MasonryGrid;
