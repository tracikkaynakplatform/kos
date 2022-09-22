import React from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateClusterWizard from "../components/CreateClusterWizard";

export default function CreateCluster(props) {
	const nav = useNavigate();
	const { manClusterName } = useParams();

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
			<CreateClusterWizard
				onFinish={() => {
					nav("/management-clusters");
				}}
				manClusterName={manClusterName}
			/>
		</DashboardLayout>
	);
}
