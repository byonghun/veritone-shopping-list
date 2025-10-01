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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalDialogProvider>
          <GlobalDrawerProvider>
            <App />
          </GlobalDrawerProvider>
        </GlobalDialogProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
