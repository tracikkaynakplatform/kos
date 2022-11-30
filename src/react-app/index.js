import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter, Route, Routes, HashRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ModalProvider } from "./hooks/useModal.js";

import AddClusterPage from "./pages/AddClusterPage.jsx";
import ManagementClustersPage from "./pages/ManagementClustersPage.jsx";
import ManagementClusterInfoPage from "./pages/ManagementClusterInfoPage.jsx";
import UpgradeClusterPage from "./pages/UpgradeClusterPage.jsx";
import CreateClusterPage from "./pages/CreateClusterPage.jsx";
import { logger } from "./logger.js";
import ManagementClusterConfigPage from "./pages/ManagementClusterConfigPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SnackbarProvider maxSnack={5}>
		<ModalProvider>
			<HashRouter>
				<Routes>
					<Route
						path="/"
						exact
						element={<ManagementClustersPage />}
					/>
					<Route
						path="/cluster/:name"
						element={<ManagementClusterInfoPage />}
					/>
					<Route
						path="/cluster/config/:name"
						element={<ManagementClusterConfigPage />}
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
			</HashRouter>
		</ModalProvider>
	</SnackbarProvider>
);

logger.debug("Rendered index.js .");
