import Head from "next/head";
import Image from "next/image";
import initDemo from "demo";
import { useEffect, useRef } from "react";

function once<F extends (...args: any[]) => any>(fn: F): F {
  let hasRun = false;
  return ((...args) => {
    if (hasRun) return;
    hasRun = true;
    return fn.apply(null, args);
  }) as F;
}

const initDemoOnce = once(initDemo);

const codeExample1 = `
/* 
These are the original sizes of the elements you want to position
The way you obtain these values is up to you
It might be measuring a bunch of images, getting this data from a backend, etc
*/

const sizes = [
    { width: 150, height: 500 }, 
    { width: 500, height: 600 }, 
    { width: 800, height: 600 }
]
`;

const codeExample2 = `
const options = {
  sizes,             // The array of sizes
  columns: 3,        // The number of columns
  width: 800,        // The width of the layout
  gutter: 8,         // (Optional) The size of the gutters
  gutterX: null,     // (Optional) The size of the horizontal gutters
  gutterY: null,     // (Optional) The size of the vertical gutters
  maxHeight: null,   // (Optional) The maximum height a single item can get
  collapsing: true,  // (Optional) If the items should collapse into each other
  centering: false,  // (Optional) Center items if there are less items than the number of columns
  customize: null;   // (Optional) A function to customize the dimensions before they get positioned
}
`;

const codeExample3 = `
import { generate } from "simple-masonry-layout"

...

const rectangles = generate(options)
`;

export default function Home() {
  const someRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (someRef.current) {
      initDemoOnce(
        someRef.current,
        Array.from({ length: 5 * 8 }).map(
          (_, i) =>
            new URL(
              `static/${(i % 5) + 1}.webp`,
              `${window.location.protocol}//${window.location.host}`
            )
        )
      );
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Simple masonry layout docs</title>
        <meta name="description" content="Simple masonry layout docs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 bg-gradient-to-b from-white via-sky-50 to-white">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="lg:py-32 col-span-1 text-center lg:text-start">
                <div className="inline-flex relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <code className="text-gray-600">
                    npm i simple-masonry-layout
                  </code>
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
                  <span>Simple</span>
                  <span>Masonry</span>
                  <br />
                  <span className="text-blue-600">Layout</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create masonry style layouts and render them any way you want.
                </p>
                <div className="mt-8 gap-x-4 inline-flex lg:flex">
                  <a
                    href="#getting-started"
                    className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-blue-600 hover:bg-blue-700 hover:ring-blue-700"
                  >
                    Getting started
                    <span className="text-indigo-200" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                  <a
                    href="https://github.com/jchn/simple-masonry-layout"
                    className="inline-block bg-white rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                  >
                    Source on Github
                    <span className="text-gray-400" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-span-1 max-w-100">
                <div ref={someRef}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 mx-auto max-w-7xl lg:px-8 lg:py-8 prose">
          <div className="max-w-prose mx-auto">
            <h1
              id="getting-started"
              className="mt-2 block text-3xl text-center font-bold leading-8 tracking-tight text-blue-600 sm:text-4xl"
            >
              Getting started
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-500">
              Create a layout by first obtaining an array of sizes, a{" "}
              <code>size</code> is an object with a <code>width</code> and{" "}
              <code>height</code> property:
            </p>
            <pre>
              <code className="language-js">{codeExample1}</code>
            </pre>
            <p className="mt-8 text-xl leading-8 text-gray-500">
              These sizes can be added to an <code>options</code> object which
              we'll use to configure our layout and has the following shape:
            </p>
            <pre>
              <code className="language-js">{codeExample2}</code>
            </pre>
            <p className="mt-8 text-xl leading-8 text-gray-500">
              Finally we can pass the options to the <code>generate</code>{" "}
              function. This function will return an array of rectangles, a{" "}
              <code>Rectangle</code> is an object with an <code>x</code>,{" "}
              <code>y</code>, <code>width</code> and <code>height</code>{" "}
              property.
            </p>
            <pre>
              <code className="language-js">{codeExample3}</code>
            </pre>
            <p className="mt-8 text-xl leading-8 text-gray-500">
              Now it's up to you to map these rectangles to the positions on
              screen using the DOM or a Canvas or anything else.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-base text-gray-400">
              You've reached the end of the page.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
