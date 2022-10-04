import React from "react";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Sidebar } from "../components/Sidebar";

export default function DashboardLayout(props) {
	return (
		<SnackbarProvider maxSnack={5}>
			<Box sx={{ display: "flex" }}>
				<Sidebar />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						flexGrow: 1,
						height: "90vh",
					}}
				>
					{props.children}
				</Box>
			</Box>
		</SnackbarProvider>
	);
}
