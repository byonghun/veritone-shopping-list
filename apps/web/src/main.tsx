import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";
import App from "./App";
import GlobalDialogProvider from "./components/providers/GlobalDialogProvider";
import GlobalDrawerProvider from "./components/providers/GlobalDrawerProvider";

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
