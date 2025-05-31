import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Create a root for rendering the application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app component to the DOM
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);