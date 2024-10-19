import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

console.log(
  "API URL:",
  process.env.REACT_APP_API_URL || window.location.origin
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
