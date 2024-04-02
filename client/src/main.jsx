import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./Router";
import AuthProvider from "./context/authProvider";
import ThemeProvider from "./context/themeProvider";
import NewMessageRenderProvider from "./context/NewMessageRenderProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <NewMessageRenderProvider>
          <Routes />
        </NewMessageRenderProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
