import React, { useState } from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Button } from "../components/UI/Button";
import { LayoutProvider } from "../hooks/useLayout";
import { useNavigate } from "react-router-dom";

export default function TempLayout({ children, onBackClicked }) {
	const nav = useNavigate();
	const [backEnabled, setBackEnabled] = useState(true);

	return (
		<LayoutProvider
			value={{
				enableBack: () => setBackEnabled(true),
				disableBack: () => setBackEnabled(false),
			}}
		>
			<Button
				variant="fab"
				disabled={backEnabled ? false : true}
				className="top-10 left-10 fixed w-16 h-16"
				onClick={onBackClicked ?? (() => nav(-1))}
			>
				<ArrowBackIcon />
			</Button>
			{children}
		</LayoutProvider>
	);
}
