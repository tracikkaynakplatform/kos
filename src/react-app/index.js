import React from "react";
import ReactDOM from "react-dom/client";
import Clusters from "./pages/Clusters";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import { Provider } from "react-redux";
import { store } from "../react-app/redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/main_window" exact element={<App />} />
                <Route path="/clusters" exact element={<Clusters />} />
            </Routes>
        </BrowserRouter>
    </Provider>
);
