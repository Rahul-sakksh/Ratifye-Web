import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <Provider store={store}>
    <QueryClientProvider client={queryClient}>
     
        <App />
     
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);