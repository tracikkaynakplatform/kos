import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Sidebar } from "../components/Sidebar";
import React from "react";

export default function DashboardLayout(props) {
	return (
		<SnackbarProvider maxSnack={5}>
			<Box sx={{ display: "flex" }}>
				<Sidebar />
				<Box
					id="dsa"
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
