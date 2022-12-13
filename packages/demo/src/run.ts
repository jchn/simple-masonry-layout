import init from "./index";

const urls = [
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/5.webp", import.meta.url),
  new URL("./img/6.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/5.webp", import.meta.url),
  new URL("./img/6.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),

  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/5.webp", import.meta.url),
  new URL("./img/6.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/5.webp", import.meta.url),
  new URL("./img/6.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
  new URL("./img/1.webp", import.meta.url),
  new URL("./img/2.webp", import.meta.url),
  new URL("./img/3.webp", import.meta.url),
  new URL("./img/4.webp", import.meta.url),
];

const container = document.querySelector("#container");

if (container) {
  init(container, urls);
}
