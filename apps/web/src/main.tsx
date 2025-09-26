import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
// Note: Allows Google Fonts to be loaded in docker container
import "@fontsource/dosis/600.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";

import "./index.css";
import App from "./App";
import GlobalDialogProvider from "./providers/GlobalDialogProvider";
import GlobalDrawerProvider from "./providers/GlobalDrawerProvider";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalDialogProvider>
        <GlobalDrawerProvider>
          <App />
        </GlobalDrawerProvider>
      </GlobalDialogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
