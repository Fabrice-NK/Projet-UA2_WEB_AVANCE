import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/stores";
import "./styles/global.css";

// Ce fichier est le point d'entrée de l'application React. Il configure le store Redux, le router React Router, et rend le composant App dans la racine du DOM. Le composant App contient les routes de l'application, qui sont protégées par le composant ProtectedRoute pour garantir que seules les utilisateurs authentifiés peuvent accéder aux pages principales de l'application.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);