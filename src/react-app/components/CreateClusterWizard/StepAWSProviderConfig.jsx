import React, { useState } from "react";
import {
	Box,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import Wrapper from "../StepWizardWrapper";
import { kubernetesVersions, machineTypes, regions } from "../../providers/aws";
import { useWizard } from "../../hooks/useWizard";
import { translate } from "../../locales";

export default function StepAWSProviderConfig({ goToNamedStep, ...props }) {
	const [region, setRegion] = useState("");
	const [masterMachineType, setMasterMachineType] = useState("");
	const [workerMachineType, setWorkerMachineType] = useState("");
	const [sshKeyName, setSshKeyName] = useState("");

	const [kubVersion, setKubVersion] = useState("");
	const [masterCount, setMasterCount] = useState(1);
	const [workerCount, setWorkerCount] = useState(1);
	const [clusterName, setClusterName] = useState("");
	const wizard = useWizard();

	return (
		<Wrapper
			onBackClick={() => {
				goToNamedStep("selectProvider");
			}}
			onNextClick={async () => {
				// TODO: Girdi doğrulama
				await wizard.updateData("kubVersion", kubVersion);
				await wizard.updateData("masterCount", masterCount);
				await wizard.updateData("clusterName", clusterName);
				await wizard.updateData("workerCount", workerCount);
				await wizard.updateData("sshKeyName", sshKeyName);
				await wizard.updateData("workerMachineType", workerMachineType);
				await wizard.updateData("masterMachineType", masterMachineType);
				await wizard.updateData("region", region);
				goToNamedStep("AWSCreateCluster");
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
				AWS Küme Bilgileri
			</Typography>
			<Box
				sx={{
					p: 3,
					width: "500px",
					display: "flex",
					gap: "10px",
				}}
			>
				<Box
					sx={{
						width: "100%",
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
						<InputLabel>
							{translate("kubernetesVersion")}
						</InputLabel>
						<Select
							value={kubVersion}
							label={translate("kubernetesVersion")}
							onChange={(e) => setKubVersion(e.target.value)}
						>
							{kubernetesVersions.map((x, i) => (
								<MenuItem value={x} key={i}>
									{x}
								</MenuItem>
							))}
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
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<TextField
						onChange={(e) => setSshKeyName(e.target.value)}
						value={sshKeyName}
						variant="outlined"
						label="SSH Anahtar İsmi"
					/>
					<FormControl fullWidth>
						<InputLabel>Master Makine Tipi</InputLabel>
						<Select
							value={masterMachineType}
							label="Master Makine Tipi"
							onChange={(e) =>
								setMasterMachineType(e.target.value)
							}
						>
							{machineTypes.map((x, i) => (
								<MenuItem value={x.name} key={i}>
									{x.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel>Worker Makine Tipi</InputLabel>
						<Select
							value={workerMachineType}
							label="Worker Makine Tipi"
							onChange={(e) =>
								setWorkerMachineType(e.target.value)
							}
						>
							{machineTypes.map((x, i) => (
								<MenuItem value={x.name} key={i}>
									{x.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel>Bölge</InputLabel>
						<Select
							value={region}
							label="Bölge"
							onChange={(e) => setRegion(e.target.value)}
						>
							{regions.map((x, i) => (
								<MenuItem value={x} key={i}>
									{x}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
		</Wrapper>
	);
}
