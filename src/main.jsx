import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import rootReducer from "./store/index.js";
import { queryClient } from "./api/queryClient";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Redux keeps client state (signed-in user, toasts); TanStack Query owns
// server state (contacts, stats).
const store = configureStore({
  reducer: rootReducer,
});

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Rendered only in development; the production build drops it. */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </Provider>
);
