import "@/styles/globals.css";
import AppLayout from "../corelayout/AppLayout/index";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/utils/schemas";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </Head>
      <Provider store={store}>
        <AppLayout>
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            theme="light"
            hideProgressBar={true}
            pauseOnHover
          />
        </AppLayout>
      </Provider>
    </>
  );
}
