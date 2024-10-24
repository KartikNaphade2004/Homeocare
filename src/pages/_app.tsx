import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head"; // Import Head component from Next.js

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Discover personalized homeopathic remedies powered by AI technology, tailored to your symptoms and health needs "
        />
        <title>HomeoCare</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
