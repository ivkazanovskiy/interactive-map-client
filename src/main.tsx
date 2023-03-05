import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import Login from "./routes/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

// TODO: make sure token updates correctly
axios.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem(
  // TODO: change string with enum
  "at",
)}`;

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "login",
    element: <Login></Login>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>,
);
