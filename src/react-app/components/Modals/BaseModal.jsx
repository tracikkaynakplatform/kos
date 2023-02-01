import React, { forwardRef } from "react";
import { Box, Modal } from "@mui/material";

export const BaseModal = forwardRef(
	({ open, onClose, children, width }, ref) => (
		<Modal ref={ref} open={open} onClose={onClose}>
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
					p: 3,
					borderRadius: "20px",
					":focus-visible": {
						outline: "none",
					},
					maxWidth: width,
				}}
			>
				{children}
			</Box>
		</Modal>
	)
);

export default BaseModal;
