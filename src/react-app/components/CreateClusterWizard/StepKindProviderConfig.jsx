import React, { useState } from "react";
import {
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	TextField,
} from "@mui/material";
import { useWizard } from "../../hooks/useWizard";
import { translate } from "../../locales";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepKindProviderConfig({ goToNamedStep, ...props }) {
	const wizard = useWizard();
	const [kubVersion, setKubVersion] = useState("");
	const [masterCount, setMasterCount] = useState(1);
	const [workerCount, setWorkerCount] = useState(1);
	const [clusterName, setClusterName] = useState("");
	const _goto = goToNamedStep;

	return (
		<Wrapper
			onNextClick={async () => {
				// TODO: Girdi doğrulama
				await wizard.updateData("kubVersion", kubVersion);
				await wizard.updateData("masterCount", masterCount);
				await wizard.updateData("clusterName", clusterName);
				await wizard.updateData("workerCount", workerCount);
				_goto("kindCreateCluster");
			}}
			onBackClick={() => {
				_goto("selectProvider");
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
				Kind - Docker yapılandırması
			</Typography>
			<Typography>
				Oluşturmak istediğiniz kümenin bilgilerini giriniz.
			</Typography>
			<Box
				sx={{
					mt: "10px",
					mb: "10px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<TextField
					onChange={(e) => setClusterName(e.target.value)}
					value={clusterName}
					label={translate("clusterName")}
				/>
				<FormControl fullWidth>
					<InputLabel>{translate("kubernetesVersion")}</InputLabel>
					<Select
						value={kubVersion}
						label={translate("kubernetesVersion")}
						onChange={(e) => setKubVersion(e.target.value)}
					>
						{/* TODO: Kind'ın desteklediği Kubernetes sürümleri alınacak */}
						<MenuItem value="1.24.0">1.24.0</MenuItem>
						<MenuItem value="1.24.4">1.24.4</MenuItem>
						<MenuItem value="1.23.10">1.23.10</MenuItem>
						<MenuItem value="1.22.13">1.22.13</MenuItem>
					</Select>
				</FormControl>
				<TextField
					InputProps={{ inputProps: { min: 1 } }}
					onChange={(e) => setMasterCount(Number(e.target.value))}
					value={masterCount}
					type="number"
					label={translate("masterMachineCount")}
				/>
				<TextField
					InputProps={{ inputProps: { min: 1 } }}
					onChange={(e) => setWorkerCount(Number(e.target.value))}
					value={workerCount}
					type="number"
					label={translate("workerMachineCount")}
				/>
			</Box>
		</Wrapper>
	);
}
