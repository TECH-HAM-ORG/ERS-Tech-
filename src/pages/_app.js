import "@/styles/globals.css";
import AppLayout from "../corelayout/AppLayout/index";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }) {
  return (
    <>
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
