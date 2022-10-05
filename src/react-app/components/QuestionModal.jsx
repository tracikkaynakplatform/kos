import React from "react";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import BaseModal from "./BaseModal.jsx";

export default function QuestionModal({
	message,
	yesButtonText,
	noButtonText,
	...props
}) {
	return (
		<BaseModal {...props}>
			<Typography sx={{ fontSize: "20px" }}>{message}</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					gap: "30px",
				}}
			>
				<Button variant="contained">{yesButtonText ?? "Tamam"}</Button>
				<Button variant="contained">{noButtonText ?? "İptal"}</Button>
			</Box>
		</BaseModal>
	);
}
