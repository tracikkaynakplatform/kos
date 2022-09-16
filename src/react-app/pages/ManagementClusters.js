import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ManagementClusterCard from "../components/ManagementClusterCard";
import { PROVIDER_TYPE } from "../providers";
import { Box, Button, Fab, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function ManagementClusters(props) {
	const [clusters, setClusters] = useState([]);

	useEffect(() => {
		(async () => {
			await setClusters(await clusterConfig.getManagementClusters());
		})();
	}, []);

	return (
		<DashboardLayout>
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
						<ManagementClusterCard key={i} {...x} />
					))}
				</Box>
			</Box>
		</DashboardLayout>
	);
}
