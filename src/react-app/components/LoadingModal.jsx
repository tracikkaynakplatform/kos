import React from "react";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";

export default function LoadingModal({ open, onClose, message }) {
	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "column",
					position: "absolute",
					gap: "10px",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					boxShadow: 24,
					backgroundColor: "white",
					p: 8,
					borderRadius: "20px",
					":focus-visible": {
						outline: "none",
					},
				}}
			>
				<Typography>{message}</Typography>
				<CircularProgress />
			</Box>
		</Modal>
	);
}
