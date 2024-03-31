import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./components/Register.tsx";
import axios from "axios";
import Home from "./components/Home.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ChatProvider from "./context/ChatProvider.tsx";

const PROD = "https://messaging-app-jquv.onrender.com/api/v1";
// const DEV = "http://localhost:8000/api/v1";

axios.defaults.baseURL = PROD;

if (localStorage.getItem("accessToken")) {
  axios.defaults.headers.common["Authorization"] =
    localStorage.getItem("accessToken");
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ChatProvider>
  </React.StrictMode>,
);
