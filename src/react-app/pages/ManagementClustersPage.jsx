import React, { useState, useEffect } from "react";
import { Box, Fab, TextField } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { useSnackbar } from "notistack";

import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ManagementClusterCard from "../components/ManagementClusterCard.jsx";
import LoadingModal from "../components/LoadingModal.jsx";
import clusterConfig from "../api/clusterConfig";

export default function ManagementClustersPage(props) {
	const [clusters, setClusters] = useState([]);
	const nav = useNavigate();
	const modal = useModal();
	const snack = useSnackbar().enqueueSnackbar;

	useEffect(() => {
		(async () => {
			modal.showModal(LoadingModal, { message: "Yükleniyor" });
			try {
				await setClusters(await clusterConfig.getManagementClusters());
			} catch (err) {
				snack(err.message, {
					variant: "error",
					autoHideDuration: 5000,
				});
			}
			modal.closeModal();
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
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
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
				</Box>
				<Box
					sx={{
						display: "flex",
						flexWrap: "normal",
						gap: "20px",
						m: 2,
					}}
				>
					{clusters.map((x, i) => (
						<ManagementClusterCard
							key={i}
							href={`/cluster/${x.name}`}
							{...x}
						/>
					))}
				</Box>
			</Box>
		</DashboardLayout>
	);
}
