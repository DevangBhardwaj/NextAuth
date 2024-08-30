import Layout from "../components/layout/layout";
import SessionsProvider from "../providers/session.provider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionsProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionsProvider>
  );
}

export default MyApp;
