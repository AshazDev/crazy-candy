import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Link to your manifest file */}
          <link rel="manifest" href="/manifest.json" />
          {/* Meta tags for PWA */}
          <meta name="theme-color" content="#d6a1ac" />
          <meta name="description" content="The best candy shop in Bahrain" />
          {/* Link to a favicon or icon */}
          <link rel="icon" href="icon512_maskable.png" />
          {/* Add any additional meta tags or links here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
