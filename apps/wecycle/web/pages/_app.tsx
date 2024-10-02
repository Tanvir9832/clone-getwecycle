import { theme } from "@tanbel/homezz/utils";
import { ConfigProvider } from "@tanbel/react-ui";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import icon from "../assets/favicon.ico";
import Layout from "../layout";
import "../styles/index.css";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WeCycle</title>
        <link rel="shortcut icon" href={icon.src} />
      </Head>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.primary,
          },
          components: {
            Segmented: {
              itemSelectedBg: theme.primary,
              itemSelectedColor: "#fff",
            },
            Menu: {
              activeBarBorderWidth: 0,
            },
          },
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
      <ToastContainer />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-T669Y4Q7G1"
      />
      <Script id="gtm">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T669Y4Q7G1');
        `}
      </Script>
    </>
  );
}

export default CustomApp;
