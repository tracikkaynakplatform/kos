import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ManagementClusterCard from "../components/ManagementClusterCard";
import { PROVIDER_TYPE } from "../providers";
import { Box, Button, Fab, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function ManagementClusters(props) {
	// TODO: Yönetim kümelerinin listesini yükle ve clusters state'i içerisine ekle.
	const [clusters, setClusters] = useState([
		{
			name: "management-cluster-1",
			supportedProviders: [
				PROVIDER_TYPE.DIGITAL_OCEAN,
				PROVIDER_TYPE.DOCKER,
			],
			clusters: [
				{ type: PROVIDER_TYPE.DIGITAL_OCEAN, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.AWS, href: "#" },
				{ type: PROVIDER_TYPE.GCP, href: "#" },
			],
		},
		{
			name: "management-cluster-2",
			supportedProviders: [PROVIDER_TYPE.AWS, PROVIDER_TYPE.GCP],
			clusters: [{ type: PROVIDER_TYPE.GCP, href: "#" }],
		},
		{
			name: "management-cluster-3",
			supportedProviders: [PROVIDER_TYPE.DIGITAL_OCEAN],
			clusters: [],
		},
	]);

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
