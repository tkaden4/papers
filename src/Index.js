import "core-js/stable";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

let el = document.getElementById("react-app");

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  el
);
