import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import React from "react";

/**
 * A quick and dirty way of getting some route transitions for demo purposes
 * Don't use this in production
 * Or do use it in production, I don't care
 */

const duration = 300;

export function TransitionTarget({
  children,
  identifier,
}: {
  children: ReactNode;
  identifier: string;
}) {
  return (
    <div id={`x-transition-${identifier}`} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

function TransitionComponent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const sharedElement = useRef<HTMLElement | null>(null);

  const currentPath = router.asPath;
  const identifier = useRef<string | null>(null);

  const observer = useRef<MutationObserver | null>(null);

  const observerCallback: MutationCallback = useCallback((entries) => {
    // Check if we can find our 'target'
    // If we find the target complete the transition

    for (const entry of entries) {
      if (entry.type == "childList") {
        if (!identifier.current) {
          return;
        }

        const target = document.getElementById(identifier.current)
          ?.childNodes[0] as HTMLElement | null;

        if (!sharedElement.current || !target) {
          return;
        }

        const rect = target?.getBoundingClientRect();

        const factor = rect.width / sharedElement.current.clientWidth;

        sharedElement.current.style.transform = `
              translate(${
                rect.x +
                (sharedElement.current.clientWidth / 2) * factor -
                sharedElement.current.clientWidth / 2
              }px, ${
          rect.y +
          (sharedElement.current.clientHeight / 2) * factor -
          sharedElement.current.clientHeight / 2
        }px)
              scale(${factor})
              `;
        sharedElement.current.style.transformOrigin = "center";
        sharedElement.current.style.transition = "all .4s";
        sharedElement.current.style.transitionTimingFunction =
          "cubic-bezier(.13,.76,.53,1.07)";

        target.classList.add("opacity-0");

        const onTransitionEnd = (e: TransitionEvent) => {
          target.classList.remove("opacity-0");
          sharedElement.current?.classList.add("invisible");
          sharedElement.current?.removeEventListener(
            "transitionend",
            onTransitionEnd
          );
          sharedElement.current = null;

          const container = document.getElementById(
            "x-transition-shared-elements"
          ) as HTMLElement;
          container.innerHTML = "";
        };

        sharedElement.current?.addEventListener(
          "transitionend",
          onTransitionEnd
        );

        observer.current?.disconnect();

        break;
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (router.isReady === false) return;

    observer.current = new MutationObserver(observerCallback);

    const className = "shared-transition-element";

    const handler: (...evts: any[]) => void = (url, a) => {
      const path = url as string;

      const params = new URL(path, window.location.origin).searchParams;

      const elem =
        (document.getElementById(`x-transition-${path}`)
          ?.firstChild as HTMLElement) ??
        (document.getElementById(`x-transition-${currentPath}`)
          ?.firstChild as HTMLElement);

      if (!elem) {
        return;
      }

      identifier.current = elem?.parentElement?.id ?? null;
      const rect = elem?.getBoundingClientRect();

      const elemClone = elem?.cloneNode(true) as HTMLElement | null;

      if (!elemClone) {
        return;
      }

      elemClone.classList.remove(
        `transition-${params.get("item")}`,
        "x-transition"
      );

      elemClone.style.cssText = `
          position: absolute;
          width: ${rect.width}px;
          height: ${rect.height}px;
          top: 0;
          left: 0;
          transform: translate(${rect.left}px, ${rect.top}px);
          z-index: 999;
        `;

      elemClone.classList.add(className, "ease-out", `duration-${duration}`);

      const sharedElementsContainer = document.getElementById(
        "x-transition-shared-elements"
      ) as HTMLElement;

      sharedElementsContainer.appendChild(elemClone);

      sharedElement.current = elemClone;

      if (!ref.current) {
        return;
      }

      observer.current?.observe(ref.current, {
        subtree: true,
        childList: true,
        attributes: false,
        attributeOldValue: false,
      });
    };

    const errorHandler: (...evts: any[]) => void = (url) => {
      sharedElement.current?.parentElement?.removeChild(sharedElement.current);

      observer.current?.disconnect();
    };

    router.events.on("routeChangeStart", handler);
    router.events.on("routeChangeError", errorHandler);

    return () => {
      router.events.off("routeChangeStart", handler);
      router.events.off("routeChangeError", errorHandler);
    };
  });

  return (
    <div style={{ display: "contents" }} ref={ref}>
      {children}
      <div
        style={{ display: "contents" }}
        id="x-transition-shared-elements"
      ></div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TransitionComponent key="wut">
      <Component {...pageProps} />
    </TransitionComponent>
  );
}
