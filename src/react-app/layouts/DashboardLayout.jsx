import React from "react";
import { Drawer, Box, List, ListItemButton, Typography } from "@mui/material";
import { Home as HomeIcon, Storage as StorageIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { sidebarWidth } from "../config";

function Sidebar() {
	const navigate = useNavigate();
	const ListButton = ({ icon: Icon, label, to }) => (
		<ListItemButton
			onClick={() => (to ? navigate(to, { replace: true }) : null)}
			sx={{
				display: "flex",
				flexDirection: "row",
				gap: "20px",
				mt: "10px",
				mb: "10px",
			}}
		>
			<Icon />
			<Typography>{label}</Typography>
		</ListItemButton>
	);

	return (
		<Drawer
			sx={{
				width: sidebarWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: sidebarWidth,
					boxSizing: "border-box",
				},
			}}
			variant="permanent"
		>
			<Box sx={{ overflow: "auto" }}>
				<List>
					<ListButton
						to="/main_window"
						icon={StorageIcon}
						label="Yönetim Kümeleri"
					/>
				</List>
			</Box>
		</Drawer>
	);
}

export default function DashboardLayout({ children }) {
	return (
		<Box sx={{ display: "flex" }}>
			<Sidebar />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					height: "100vh",
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
