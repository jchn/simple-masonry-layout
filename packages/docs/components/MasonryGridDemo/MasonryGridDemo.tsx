import React, { useState } from "react";
import MasonryGrid from "@jchn/simple-masonry-layout-react";
import Image from "next/image";
import style from "./demo.module.css";

const GridImage: React.FC<{
  src: string;
  width: number;
  height: number;
  x: number;
  y: number;
}> = ({ src, width, height, x, y }) => {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className={`shadow-md ${style.GridImage}`}
    />
  );
};

const items = [
  { data: { key: "1" }, size: { width: 1024, height: 576 } },
  { data: { key: "2" }, size: { width: 512, height: 1024 } },
  { data: { key: "3" }, size: { width: 512, height: 512 } },
  { data: { key: "4" }, size: { width: 512, height: 1024 } },
  { data: { key: "5" }, size: { width: 1024, height: 576 } },
  { data: { key: "6" }, size: { width: 512, height: 1024 } },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const randomise = () => {
  return {
    gutter: randomItem([0, 8, 16, 32, 64]),
    columns: randomItem([2, 3, 4]),
    collapsing: randomItem([true, true, false]),
  };
};

const MasonryGridDemo = () => {
  const [options, setOptions] = useState<{
    gutter: number;
    columns: number;
    collapsing: boolean;
  }>({
    gutter: 10,
    columns: 3,
    collapsing: true,
  });
  return (
    <div className={style.MasonryGridDemo}>
      <div className={style.MasonryGridDemo__scrollContainer}>
        <MasonryGrid
          items={[...items, ...items, ...items, ...items]}
          width={600}
          columns={options.columns}
          options={{ gutter: options.gutter, collapsing: options.collapsing }}
          onClick={() => setOptions(randomise())}
          renderItem={({ rect, data: { key } }) => (
            <GridImage key={key} src={`/static/${key}.webp`} {...rect} />
          )}
        />
      </div>
    </div>
  );
};

export default MasonryGridDemo;
