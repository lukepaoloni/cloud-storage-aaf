import "@assets/scss/black-dashboard-react.scss";
import "@assets/css/nucleo-icons.css";

import { configure } from "mobx";
import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AuthStore from "./stores/AuthStore/AuthStore";
import UserStore from "./stores/UserStore/UserStore";
import FilesStore from "./stores/FilesStore/FilesStore";

configure({ enforceActions: "always" });

const stores = {
  AuthStore,
  UserStore,
  FilesStore
};
//@ts-ignore
window.______APP_STATE______ = stores;

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
