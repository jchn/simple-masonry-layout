import Layout from "@jchn/simple-masonry-layout-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TransitionTarget } from "../_app";
import { ImageResponseItem } from "../api/images";
import Image from "next/image";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<ImageResponseItem[], string> = (url) =>
  fetch(url).then((res) => res.json());

export default function ReactExample() {
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

  const { data: images } = useSWR("/api/images", fetcher);

  return (
    <div style={{ width: "100%" }} ref={observerRef}>
      {width && images && (
        <Layout
          columns={colsForWidth(width)}
          width={width}
          items={images.map((image) => ({
            size: image.size,
            data: { url: image.url, key: image.id },
          }))}
          options={{ gutter: 5 }}
          renderContent={({ data, rect }) => (
            <Link
              href={{
                pathname: `reactExample/detail/${data.key}`,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${rect.x}px, ${rect.y}px)`,
                height: "auto",
              }}
            >
              <TransitionTarget identifier={`/reactExample/detail/${data.key}`}>
                <Image
                  src={data.url}
                  alt="An image generated by Stable Diffusion"
                  width={rect.width}
                  height={rect.height}
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
