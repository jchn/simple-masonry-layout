import Head from "next/head";
import initDemo from "demo";
import { useEffect, useRef } from "react";
import CodeBlock from "../components/CodeBlock/index";

function once<F extends (...args: any[]) => any>(fn: F): F {
  let hasRun = false;
  return ((...args) => {
    if (hasRun) return;
    hasRun = true;
    return fn.apply(null, args);
  }) as F;
}

const initDemoOnce = once(initDemo);

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
                    npm i @jchn/simple-masonry-layout
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

            <h2>Install</h2>

            <code>npm install @jchn/simple-masonry-layout</code>

            <h2>Creating rectangles</h2>

            <p className="mt-8 text-xl leading-8 text-gray-500">
              SimpleMasonryLayout has one single function which is called{" "}
              <code>getRectangles</code>, this function will return an array of
              rectangles:
            </p>

            <CodeBlock language="typescript" showLineNumbers>
              {`import { getRectangles } from '@jchn/simple-masonry-layout'

const sizes = [{ width: 150, height: 200 }, { width: 200, height: 150 }]

const rectangles = getRectangles(sizes, 800, 3, { gutter: 10 })`}
            </CodeBlock>
            <details>
              <summary>
                <code>getRectangles(params)</code>
              </summary>
              <CodeBlock language="typescript">
                {`getRectangles(
  sizes: Size[],    // The input dimensions, oftentimes the width and height of an image
  width: number,    // The width of the grid
  columns: number,  // The number of columns
  options?: Options // More options
) => Rect[]
              
type Size = { 
  width: number, 
  height: number 
}

type Options = {
  gutter: number,   // x and y gutter
  gutterX: number,  // x gutter
  gutterY: number,  // y gutter
  paddingY: number, // additional height added to rectangle
  collapsing: bool, // if the elements should collapse into each other
  centering: bool   // if the elements should be centered if there are less items then columns
}

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number
}`}
              </CodeBlock>
            </details>

            <p className="mt-8 text-xl leading-8 text-gray-500">
              Now it&apos;s up to you to translate these rectangles to something
              on screen using the DOM or a Canvas or anything else:
            </p>

            <CodeBlock
              language="typescript"
              showLineNumbers
              startingLineNumber={10}
            >
              {`rectangles.forEach(rectangle => {
  const div = document.createElement('div')

  div.style.cssText = \`
    position: absolute;
    top: \${rectangle.x};
    left: \${rectangle.y};
    width: \${rectangle.width}px;
    height: \${rectangle.height}px;
    border: 1px solid;
  \`

  document.body.appendChild(div)
})`}
            </CodeBlock>
          </div>
        </div>

        <h1
          id="getting-started"
          className="mt-2 block text-3xl text-center font-bold leading-8 tracking-tight text-blue-600 sm:text-4xl"
        >
          Examples
        </h1>

        <p>Add a couple of grid tiles linking to examples.</p>
      </main>
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-base text-gray-400">
              You&apos;ve reached the end of the page.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
