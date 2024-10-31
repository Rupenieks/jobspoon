import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);

// Wrap in try-catch to help debug potential React initialization issues
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error rendering React app:", error);
}
