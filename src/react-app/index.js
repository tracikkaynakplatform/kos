import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ModalProvider } from "./hooks/useModal.js";

import AddClusterPage from "./pages/AddClusterPage.jsx";
import ManagementClustersPage from "./pages/ManagementClustersPage.jsx";
import ManagementClusterInfoPage from "./pages/ManagementClusterInfoPage.jsx";
import UpgradeClusterPage from "./pages/UpgradeClusterPage.jsx";
import CreateClusterPage from "./pages/CreateClusterPage.jsx";
import MainPage from "./pages/MainPage.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SnackbarProvider maxSnack={5}>
		<ModalProvider>
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
					<Route
						path="/add-cluster"
						exact
						element={<AddClusterPage />}
					/>
					<Route
						path="/create-cluster/:manClusterName"
						exact
						element={<CreateClusterPage />}
					/>
					<Route
						path="/upgrade-cluster/:manClusterName/:clusterName"
						exact
						element={<UpgradeClusterPage />}
					/>
				</Routes>
			</BrowserRouter>
		</ModalProvider>
	</SnackbarProvider>
);
