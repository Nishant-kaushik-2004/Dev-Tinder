import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "./App.css";
import { AuthBootstrap } from "./components/auth/AuthBootstrap.js";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <App />
      </AuthBootstrap>
    </Provider>
  </StrictMode>,
);
