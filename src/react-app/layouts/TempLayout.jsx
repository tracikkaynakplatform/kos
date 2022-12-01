import React from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Button } from "../components/UI/Button";

export default function TempLayout({ children, backEnabled, onBackClicked }) {
	return (
		<>
			<Button
				variant="fab"
				disabled={!!backEnabled ? !!!backEnabled : false}
				className="top-10 left-10 fixed w-16 h-16"
				onClick={onBackClicked ?? (() => {})}
			>
				<ArrowBackIcon />
			</Button>
			{children}
		</>
	);
}
