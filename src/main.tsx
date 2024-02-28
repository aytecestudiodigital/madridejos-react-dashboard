import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";
import "./i18n/i18n";
import "./index.css";
import { store } from "./store/store";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertProvider>
        <App />
      </AlertProvider>
    </Provider>
  </React.StrictMode>,
);
