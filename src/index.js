import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
// eslint-disable-next-line import/no-named-as-default-member, import/no-named-as-default
import App from "./App";

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
