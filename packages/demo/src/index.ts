import {
  getLayout,
  Options,
  GridItem,
  Item,
  Layout,
} from "@jchn/simple-masonry-layout";
import cssText from "bundle-text:./style.css";

type DemoOptions = Options & { columns: number; width: number };

let options: DemoOptions = {
  gutter: 16,
  centering: false,
  collapsing: true,
  width: 600,
  columns: 4,
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const loadImage: (url: URL) => Promise<HTMLImageElement> = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url.pathname;
  });

function last<T>(items: T[]): T | null {
  return items[items.length - 1] ?? null;
}

let layout: Layout<HTMLImageElement> | null = null;

function createLayout(
  options: DemoOptions,
  images: HTMLImageElement[]
): Layout<HTMLImageElement> {
  const items: Item<HTMLImageElement>[] = images.map((img) => ({
    size: { width: img.width, height: img.height },
    data: img,
  }));

  const layout = getLayout(items, options.width, options.columns, options);

  return layout;
}

function updateGridItems(items: GridItem<HTMLImageElement>[]) {
  items.forEach((item) => {
    item.data.width = item.rect.width;
    item.data.height = item.rect.height;

    item.data.style.transform = `translate(${item.rect.x}px, ${item.rect.y}px)`;
    item.data.style.width = `${item.rect.width}px`;
    item.data.style.height = `${item.rect.height}px`;
  });

  const scroll = document.querySelector<HTMLElement>(".scrollContainer");

  if (scroll === null) return;

  const lastItem = last(items);

  if (lastItem) {
    scroll.style.height = `${
      lastItem.rect.y ?? 0 + lastItem.rect.height ?? 0
    }px`;
  }
}

function shuffleGrid() {
  options.gutter = randomItem([0, 8, 16, 32, 64]);
  options.columns = randomItem([2, 3, 4]);
  options.collapsing = randomItem([true, true, false]);

  updateGridItems(
    createLayout(options, layout?.items.map((item) => item.data) ?? []).items
  );
}

function init(root: HTMLElement, imagePaths: URL[]) {
  const style = document.createElement("style");
  style.textContent = cssText;
  const shadow = root.attachShadow({ mode: "open" });
  shadow.appendChild(style);

  const container = document.createElement("div");
  container.classList.add("demo");
  container.innerHTML =
    '<div class="container"><div class="scrollContainer"></div></div>';

  shadow.appendChild(container);

  // Load data
  Promise.all(imagePaths.map(loadImage)).then((imgs) => {
    layout = createLayout(options, imgs);

    const scrollContainer = shadow.querySelector(".scrollContainer");

    scrollContainer?.replaceChildren(...layout.items.map((item) => item.data));
    scrollContainer?.addEventListener("animationiteration", shuffleGrid);

    updateGridItems(layout.items);

    container?.addEventListener("click", shuffleGrid);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        scrollContainer?.classList.remove("js-paused");
      } else {
        scrollContainer?.classList.add("js-paused");
      }
    });
  });
}

export default init;
