import { generate } from "simple-masonry-layout";
import { Rect, SimpleMasonryLayoutOptions } from "simple-masonry-layout";
import cssText from "bundle-text:./style.css";

let options: Omit<SimpleMasonryLayoutOptions, "sizes"> = {
  gutter: 16,
  columns: 4,
  width: 600,
  centering: false,
  collapsing: true,
};

type GridItem = {
  img: HTMLImageElement;
  rectangle: Rect;
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const once = (fn) => {
  let hasRun = false;
  return (...args) => {
    if (hasRun) return;
    fn.apply(null, args);
    hasRun = true;
  };
};

const loadImage: (url: URL) => Promise<HTMLImageElement> = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

function last<T>(items: T[]): T | null {
  return items[items.length - 1] ?? null;
}

let gridItems: GridItem[] = [];

function createGridItems(
  options: Omit<SimpleMasonryLayoutOptions, "sizes">,
  images: HTMLImageElement[]
): GridItem[] {
  const sizes = images.map((img) => ({ width: img.width, height: img.height }));
  return generate({ ...options, sizes }).map((rectangle, i) => ({
    img: images[i],
    rectangle,
  }));
}

function updateGridItems(items: GridItem[]) {
  items.forEach((item) => {
    item.img.width = item.rectangle.width;
    item.img.height = item.rectangle.height;

    item.img.style.transform = `translate(${item.rectangle.x}px, ${item.rectangle.y}px)`;
    item.img.style.width = `${item.rectangle.width}px`;
    item.img.style.height = `${item.rectangle.height}px`;
  });

  const scroll = document.querySelector<HTMLElement>(".scrollContainer");

  if (scroll === null) return;

  const lastItem = last(items);

  if (lastItem) {
    scroll.style.height = `${
      lastItem.rectangle.y ?? 0 + lastItem.rectangle.height ?? 0
    }px`;
  }
}

function shuffleGrid() {
  options.gutter = randomItem([0, 8, 16, 32, 64]);
  options.columns = randomItem([2, 3, 4]);
  options.collapsing = randomItem([true, true, false]);

  updateGridItems(
    createGridItems(
      options,
      gridItems.map((item) => item.img)
    )
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
    gridItems = createGridItems(options, imgs);

    const scrollContainer = shadow.querySelector(".scrollContainer");

    scrollContainer?.replaceChildren(...gridItems.map((item) => item.img));
    scrollContainer?.addEventListener("animationiteration", shuffleGrid);

    updateGridItems(gridItems);

    container?.addEventListener("click", shuffleGrid);

    window.addEventListener("focus", () => {
      scrollContainer?.classList.remove("js-paused");
    });

    window.addEventListener("blur", () => {
      scrollContainer?.classList.add("js-paused");
    });
  });
}

export default once(init);