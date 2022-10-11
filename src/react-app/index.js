import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import AddClusterPage from "./pages/AddClusterPage.jsx";
import ManagementClustersPage from "./pages/ManagementClustersPage.jsx";
import ManagementClusterInfoPage from "./pages/ManagementClusterInfoPage.jsx";
import CreateClusterPage from "./pages/CreateClusterPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import { ModalProvider } from "./hooks/useModal.js";

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
				</Routes>
			</BrowserRouter>
		</ModalProvider>
	</SnackbarProvider>
);
