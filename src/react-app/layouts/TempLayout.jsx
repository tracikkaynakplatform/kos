import React from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Fab } from "@mui/material";

export default function TempLayout({ children, backEnabled, onBackClicked }) {
	return (
		<>
			<Fab
				color="primary"
				disabled={!!backEnabled ? !!!backEnabled : false}
				sx={{
					margin: 0,
					top: "auto",
					left: "auto",
					position: "fixed",
				}}
				onClick={onBackClicked ?? (() => {})}
			>
				<ArrowBackIcon />
			</Fab>
			{children}
		</>
	);
}
