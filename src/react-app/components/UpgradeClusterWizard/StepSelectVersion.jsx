import React from "react";
import {
	Typography,
	CircularProgress,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepSelectVersion({ goToNamedStep, ...props }) {
	const [cpKubVersion, setCPKubVersion] = useState({ id: "" });
	const [wKubVersion, setWKubVersion] = useState({ id: "" });
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;
	const imageVersions = {
		"kindest/node:v1.24.0": "v1.24.6",
		"kindest/node:v1.25.1": "v1.25.1",
		"kindest/node:v1.25.2": "v1.25.2",
	};

	return (
		<Wrapper
			disableBack
			onNextClick={async () => {
				try {
					// TODO: Girdileri doğrula
					// TODO: Provider'ı tespit edip ona göre template'i düzenle
					// Cluster'ın kind cluster'ı olduğu varsayılıyor.
					wizard.updateData("cpKubVersion", cpKubVersion);
					wizard.updateData("wKubVersion", wKubVersion);

					_goto("applyTemplates");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
				}
			}}
			{...props}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Yükseltme bilgilerini girin
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					gap: "10px",
					width: "500px",
					mb: "10px",
				}}
			>
				<FormControl fullWidth>
					<InputLabel>Control Plane Kubernetes sürümü</InputLabel>
					<Select
						value={cpKubVersion.id}
						label="Control Plane Kubernetes sürümü"
						onChange={(e) => {
							setCPKubVersion({
								id: e.target.value,
								version: imageVersions[e.target.value],
							});
						}}
					>
						{/* TODO: Yükseltilebilir sürümler dinamik olarak alınacak  */}
						<MenuItem value="kindest/node:v1.24.0">
							v1.24.6
						</MenuItem>
						<MenuItem value="kindest/node:v1.25.1">
							v1.25.1
						</MenuItem>
						<MenuItem value="kindest/node:v1.25.2">
							v1.25.2
						</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel>Worker Kubernetes sürümü</InputLabel>
					<Select
						value={wKubVersion.id}
						label="Worker Kubernetes sürümü"
						onChange={(e) =>
							setWKubVersion({
								id: e.target.value,
								version: e.target.innerText,
							})
						}
					>
						{/* TODO: Yükseltilebilir sürümler dinamik olarak alınacak  */}
						<MenuItem value="kindest/node:v1.24.0">
							v1.24.6
						</MenuItem>
						<MenuItem value="kindest/node:v1.25.1">
							v1.25.1
						</MenuItem>
						<MenuItem value="kindest/node:v1.25.2">
							v1.25.2
						</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</Wrapper>
	);
}
