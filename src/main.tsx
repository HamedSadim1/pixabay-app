import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep cached results fresh in the background without blocking the UI,
      // so navigating away and back shows data instantly instead of a spinner.
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
