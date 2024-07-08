import React from "react";
import ReactDOM from "react-dom/client";
import "../src/app/layout/styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import { ThemeProvider } from "./components/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
