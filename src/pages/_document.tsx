import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-bg" style={{
        background: 'var(--color-background)'
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
