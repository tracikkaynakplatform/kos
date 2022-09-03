import {
	Drawer,
	Toolbar,
	Box,
	List,
	ListItemButton,
	Typography,
} from "@mui/material";
import { Home as HomeIcon, Storage as StorageIcon } from "@mui/icons-material";
import { sidebarWidth } from "../config";
import React from "react";
import { useNavigate } from "react-router-dom";

function SidebarListButton({ icon, to, label, ...props }) {
	const navigate = useNavigate();
	return (
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
			{icon}
			<Typography>{label}</Typography>
		</ListItemButton>
	);
}

export function Sidebar(props) {
	return (
		<Drawer
			sx={{
				width: sidebarWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: sidebarWidth,
					boxSizing: "border-box",
				},
				...props,
			}}
			variant="permanent"
		>
			<Box sx={{ overflow: "auto" }}>
				<List>
					<SidebarListButton
						to="/main_window"
						icon={<HomeIcon />}
						label="Ana Sayfa"
					/>
					<SidebarListButton
						to="/clusters"
						icon={<StorageIcon />}
						label="Kümeler"
					/>
				</List>
			</Box>
		</Drawer>
	);
}
