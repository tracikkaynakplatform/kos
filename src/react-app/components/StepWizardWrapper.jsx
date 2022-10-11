import React, { useEffect } from "react";
import { Box, Button, Card } from "@mui/material";
import { useWizard } from "../hooks/useWizard";

export default function StepWizardWrapper({
	disableBack,
	disableNext,
	onBackClick,
	onNextClick,
	onLoad,
	stepName,
	sx,
	children,
}) {
	const wizard = useWizard();
	useEffect(() => {
		if (wizard.stepName == stepName) onLoad?.();
	}, [wizard.stepName]);
	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: "column",
				p: 3,
				...sx,
			}}
		>
			{children}
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-end",
					gap: "10px",
				}}
			>
				<Button
					disabled={!!disableBack}
					onClick={onBackClick}
					variant="contained"
				>
					Geri
				</Button>
				<Button
					disabled={!!disableNext}
					onClick={onNextClick}
					variant="contained"
				>
					İleri
				</Button>
			</Box>
		</Card>
	);
}
