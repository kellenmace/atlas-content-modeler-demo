import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>ACM Demo</title>
      </Head>
      <main>{children}</main>
    </>
  );
}
