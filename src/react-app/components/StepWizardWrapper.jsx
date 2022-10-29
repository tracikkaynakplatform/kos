import React, { useEffect } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import { useWizard } from "../hooks/useWizard";

export default function StepWizardWrapper({
	disableBack,
	disableNext,
	onBackClick,
	onNextClick,
	onLoad,
	title,
	text,
	stepName,
	width,
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
				width: (width ?? 300) + "px",
				p: 2,
				...sx,
			}}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				{title}
			</Typography>
			{!!text ? <Typography>{text}</Typography> : null}
			<Box
				sx={{
					mt: "10px",
					mb: "10px",
					display: "flex",
					gap: "10px",
				}}
			>
				{children}
			</Box>
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
