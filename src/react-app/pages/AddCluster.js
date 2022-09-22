import React from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AddClusterWizard from "../components/AddClusterWizard";

export default function AddCluster(props) {
	const nav = useNavigate();

	return (
		<DashboardLayout>
			<Fab
				color="primary"
				sx={{
					margin: 0,
					top: "auto",
					left: "auto",
					position: "fixed",
				}}
				onClick={() => nav(-1)}
			>
				<ArrowBackIcon />
			</Fab>
			<AddClusterWizard />
		</DashboardLayout>
	);
}
