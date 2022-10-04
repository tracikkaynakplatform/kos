import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../react-app/redux/store";

import AddClusterPage from "./pages/AddClusterPage";
import ManagementClustersPage from "./pages/ManagementClusters";
import ManagementClusterInfoPage from "./pages/ManagementClusterInfoPage";
import CreateClusterPage from "./pages/CreateClusterPage";
import MainPage from "./pages/MainPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path="/main_window" exact element={<MainPage />} />
				<Route
					path="/cluster/:name"
					element={<ManagementClusterInfoPage />}
				/>
				<Route
					path="/management-clusters"
					exact
					element={<ManagementClustersPage />}
				/>
				<Route path="/add-cluster" exact element={<AddClusterPage />} />
				<Route
					path="/create-cluster/:manClusterName"
					exact
					element={<CreateClusterPage />}
				/>
			</Routes>
		</BrowserRouter>
	</Provider>
);
