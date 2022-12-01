import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, HashRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ModalProvider } from "./hooks/useModal";
import { logger } from "./logger";
import {
	AddClusterPage,
	CreateClusterPage,
	ManagementClustersPage,
	ManagementClusterInfoPage,
	ManagementClusterConfigPage,
	UpgradeClusterPage,
} from "./pages";

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
