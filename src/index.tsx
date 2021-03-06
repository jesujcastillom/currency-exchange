import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { CurrencyExchange } from "./features/currencyExchange/CurrencyExchange";
import { store } from "./app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CurrencyExchange />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
