import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
