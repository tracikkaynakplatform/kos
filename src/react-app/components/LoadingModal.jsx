import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import BaseModal from "./BaseModal.jsx";

export default function LoadingModal({ message, ...props }) {
	return (
		<BaseModal {...props}>
			<Typography>{message}</Typography>
			<CircularProgress />
		</BaseModal>
	);
}
