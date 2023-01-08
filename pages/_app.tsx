import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { MoralisDappProvider } from "../src/providers/MoralisDappProvider/MoralisDappProvider";
import { env } from "../next.config";
const APP_ID = process.env.NEXT_APP_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_APP_MORALIS_SERVER_URL;

// const APP_ID = NEXT_APP_MORALIS_SERVER_URL
// const SERVER_URL = NEXT_APP_MORALIS_APP_ID

function Hackfs({ Component, pageProps }: AppProps) {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  //validate
  if (!APP_ID || !SERVER_URL) throw new Error("Missing Moralis Credentials");
  if (isServerInfo)
    return (
      <MoralisProvider
        appId={APP_ID}
        serverUrl={SERVER_URL}
        initializeOnMount={true}
      >
        <MoralisDappProvider>
          <Component {...pageProps} />
        </MoralisDappProvider>
      </MoralisProvider>
    );
}

export default Hackfs;
