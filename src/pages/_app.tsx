import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
  return (
  <SessionProvider session={session}>
    <ToastContainer
     position="top-left"
     autoClose={2500}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover
     theme="dark"
    />
    <ToastContainer />
    <EdgeStoreProvider>
    <Component {...pageProps} />
    </EdgeStoreProvider>
  </SessionProvider>
  );
}
