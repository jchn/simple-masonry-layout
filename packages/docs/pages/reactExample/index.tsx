import Grid from "@jchn/simple-masonry-layout-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { TransitionTarget } from "../_app";
import { ImageResponseItem } from "../api/images";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function ReactExample({ children }: { children: ReactNode }) {
  const observerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const elementToObserve = observerRef.current;

    resizeObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = entry.contentBoxSize[0];
          const width = contentBoxSize.inlineSize;
          setWidth(width);
        }
      }
    });

    if (elementToObserve) {
      resizeObserver.current.observe(elementToObserve);
    }

    setWidth(elementToObserve?.clientWidth ?? null);

    return () => {
      if (elementToObserve) {
        resizeObserver.current?.unobserve(elementToObserve);
      }
    };
  }, []);

  function colsForWidth(width: number): number {
    if (width < 500) {
      return 1;
    }
    if (width < 800) {
      return 2;
    }

    return 3;
  }

  const { data: images } = useSWR<ImageResponseItem[]>("/api/images", fetcher);

  return (
    <div style={{ width: "100%" }} ref={observerRef}>
      {width && images && (
        <Grid
          gutter={5}
          columns={colsForWidth(width)}
          width={width}
          items={images.map((image) => ({
            key: image.id,
            size: image.size,
            data: { url: image.url },
          }))}
          renderContent={(data) => (
            <Link
              href={{
                pathname: `reactExample/detail/${data.key}`,
              }}
              scroll={false}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${data.rectangle.x}px, ${data.rectangle.y}px)`,
                height: "auto",
              }}
            >
              <TransitionTarget identifier={`/reactExample/detail/${data.key}`}>
                <Image
                  src={data.data.url}
                  alt="An image generate by Stable Diffusion"
                  width={data.rectangle.width}
                  height={data.rectangle.height}
                  priority={true}
                />
              </TransitionTarget>
            </Link>
          )}
        />
      )}
    </div>
  );
}
