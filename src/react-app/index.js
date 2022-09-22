import React from "react";
import ReactDOM from "react-dom/client";
import ManagementClusters from "./pages/ManagementClusters";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import { Provider } from "react-redux";
import { store } from "../react-app/redux/store";
import AddCluster from "./pages/AddCluster";
import ManagementClusterInfo from "./pages/ManagementClusterInfo";
import CreateCluster from "./pages/CreateCluster";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path="/main_window" exact element={<App />} />
				<Route
					path="/cluster/:name"
					element={<ManagementClusterInfo />}
				/>
				<Route
					path="/management-clusters"
					exact
					element={<ManagementClusters />}
				/>
				<Route path="/add-cluster" exact element={<AddCluster />} />
				<Route
					path="/create-cluster/:manClusterName"
					exact
					element={<CreateCluster />}
				/>
			</Routes>
		</BrowserRouter>
	</Provider>
);
