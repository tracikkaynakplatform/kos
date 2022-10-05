import React from "react";
import { Box, Typography, Button } from "@mui/material";
import BaseModal from "./BaseModal.jsx";

export default function QuestionModal({
	message,
	yesButtonText,
	noButtonText,
	yesButtonColor,
	noButtonColor,
	onYesClick,
	onNoClick,
	...props
}) {
	return (
		<BaseModal {...props}>
			<Typography sx={{ fontSize: "20px" }}>{message}</Typography>
			<Box
				sx={{
					display: "flex",
					width: "100%",
					justifyContent: "flex-end",
					gap: "30px",
				}}
			>
				<Button
					onClick={onYesClick}
					color={yesButtonColor}
					variant="contained"
				>
					{yesButtonText ?? "Tamam"}
				</Button>
				<Button
					onClick={onNoClick}
					color={noButtonColor}
					variant="contained"
				>
					{noButtonText ?? "İptal"}
				</Button>
			</Box>
		</BaseModal>
	);
}
