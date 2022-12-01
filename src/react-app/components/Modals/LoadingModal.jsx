import React from "react";
import { CircularProgress } from "@mui/material";
import { BaseModal } from "./";

export default function LoadingModal({ message, ...props }) {
	return (
		<BaseModal {...props}>
			{message}
			<CircularProgress />
		</BaseModal>
	);
}
