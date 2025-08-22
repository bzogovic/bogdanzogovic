import React from "react";
import ReactDOM from "react-dom";
import { BaseProvider, LightTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./assets/font-awesome/css/all.css";
// Use direct bundled entrypoints for compatibility with older CRA resolver
import { Analytics } from "@vercel/analytics/dist/react";
import { SpeedInsights } from "@vercel/speed-insights/dist/react";

const engine = new Styletron();

// observability configuration from env vars (set these in Vercel project settings)
const observabilityBase = process.env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
const analyticsDsn = process.env.REACT_APP_VERCEL_ANALYTICS_DSN;
const speedDsn = process.env.REACT_APP_VERCEL_SPEED_DSN;
const isProd = process.env.NODE_ENV === "production";

function RenderApp() {
  // log when the SDK scripts have injected a global queue
  React.useEffect(() => {
    let aInterval;
    let sInterval;
    // poll for analytics queue
    aInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.va) {
        // eslint-disable-next-line no-console
        console.info("[Vercel Analytics] SDK loaded (window.va detected)");
        clearInterval(aInterval);
      }
    }, 300);
    // poll for speed insights queue
    sInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.si) {
        // eslint-disable-next-line no-console
        console.info("[Vercel SpeedInsights] SDK loaded (window.si detected)");
        clearInterval(sInterval);
      }
    }, 300);
    return () => {
      clearInterval(aInterval);
      clearInterval(sInterval);
    };
  }, []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <App />
        {/* pass optional basePath / dsn from env vars so you can test locally or use custom endpoints */}
        <Analytics
          basePath={observabilityBase}
          dsn={analyticsDsn}
          debug={!isProd}
        />
        <SpeedInsights
          basePath={observabilityBase}
          dsn={speedDsn}
          debug={!isProd}
        />
      </BaseProvider>
    </StyletronProvider>
  );
}

ReactDOM.render(<RenderApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
