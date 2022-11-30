import React, { useState, useEffect } from "react";
import { Box, Fab, TextField } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import clusterConfig from "../api/clusterConfig";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ManagementClusterCard from "../components/ManagementClusterCard.jsx";
import Loading from "../components/Snackbars/Loading.jsx";

export default function ManagementClustersPage() {
	const [clusters, setClusters] = useState([]);
	const nav = useNavigate();
	const { enqueueSnackbar: snack, closeSnackbar } = useCustomSnackbar();

	useEffect(() => {
		(async () => {
			let loading = snack(
				"Yönetim kümeleri yükleniyor",
				{ persist: true },
				Loading
			);
			try {
				await setClusters(await clusterConfig.getManagementClusters());
			} catch (err) {
				snack(err.message, {
					variant: "error",
					autoHideDuration: 5000,
				});
			}
			closeSnackbar(loading);
		})();
	}, []);

	return (
		<DashboardLayout>
			<Fab
				color="primary"
				sx={{
					margin: 0,
					top: "auto",
					right: 20,
					bottom: 20,
					left: "auto",
					position: "fixed",
				}}
				onClick={() => nav("/add-cluster")}
			>
				<Add />
			</Fab>
			<div className="flex flex-col">
				<div className="flex items-center">
					<TextField
						sx={{
							m: 3,
							flexGrow: 1,
							"& .MuiOutlinedInput-root": {
								borderRadius: 25,
							},
						}}
						label="Ara..."
						variant="outlined"
					/>
					<Fab
						sx={{ mr: "10px" }}
						color="primary"
						variant="contained"
					>
						<Search />
					</Fab>
				</div>
				<div className="flex flex-wrap gap-[12px] m-3">
					{clusters.map((x, i) => (
						<ManagementClusterCard
							key={i}
							href={`/cluster/${x.name}`}
							{...x}
						/>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
