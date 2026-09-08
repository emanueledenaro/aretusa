import React from "react";
import { createRoot } from "react-dom/client";
import "../../../packages/ui/src/styles.css";
import "./site.css";
import "./product.css";
import "./responsive.css";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
