import {
	Typography,
	Box,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	TextField,
} from "@mui/material";
import {
	regions,
	kubernetesVersions,
	machineSizes,
	customImages,
} from "../../providers/digitalocean";
import React from "react";
import { useState } from "react";
// import { useSnackbar } from 'notistack';
import { translate } from "../../locales";
import Wrapper from "../StepWizardWrapper";

export default function StepDigitalOceanClusterConfig(props) {
	// const snack = useSnackbar().enqueueSnackbar;
	const [kubVersion, setKubVersion] = useState("");
	const [masterCount, setMasterCount] = useState(1);
	const [workerCount, setWorkerCount] = useState(1);
	const [clusterName, setClusterName] = useState("");
	const [region, setRegion] = useState("");
	const [workerImageid, setWorkerImageid] = useState("");
	const [masterImageid, setMasterImageId] = useState("");
	const [masterMachineSize, setMasterMachineSize] = useState("");
	const [workerMachineSize, setWorkerMachineSize] = useState("");

	//const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			onNextClick={() => {
				_goto("selectProvider");
			}}
			onBackClick={() => {
				_goto("digitalocean");
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
				DigitalOcean küme bilgileri
			</Typography>
			<Typography>
				Oluşturmak istediğiniz kümenin yapılandırmasını girin.
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
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						gap: "10px",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "300px",
							gap: "10px",
						}}
					>
						<FormControl fullWidth>
							<InputLabel>{translate("region")}</InputLabel>
							<Select
								value={region}
								label={translate("region")}
								onChange={(e) => setRegion(e.target.value)}
							>
								{regions.map((x) => (
									<MenuItem key={x.key} value={x.key}>
										{x.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth>
							<InputLabel>
								{translate("kubernetesVersion")}
							</InputLabel>
							<Select
								value={kubVersion}
								label={translate("kubernetesVersion")}
								onChange={(e) => setKubVersion(e.target.value)}
							>
								{kubernetesVersions.map((kv) => (
									<MenuItem key={kv} value={kv}>
										{kv}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth>
							<InputLabel>İşçi makine boyutu</InputLabel>
							<Select
								value={workerMachineSize}
								label="İşçi makine boyutu"
								onChange={(e) =>
									setWorkerMachineSize(e.target.value)
								}
							>
								{machineSizes.map((x) => (
									<MenuItem key={x.name} value={x.name}>
										{x.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth>
							<InputLabel>Yönetici makine boyutu</InputLabel>
							<Select
								value={masterMachineSize}
								label="Yönetici makine boyutu"
								onChange={(e) =>
									setMasterMachineSize(e.target.value)
								}
							>
								{machineSizes.map((x) => (
									<MenuItem key={x.name} value={x.name}>
										{x.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "300px",
							gap: "10px",
						}}
					>
						<FormControl fullWidth>
							<InputLabel>Yönetici makine kalıbı</InputLabel>
							<Select
								value={masterImageid}
								label="Yönetici makine kalıbı"
								onChange={(e) =>
									setMasterImageId(e.target.value)
								}
							>
								{customImages.map((x) => (
									<MenuItem key={x.id} value={x.id}>
										{x.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>İşçi makine kalıbı</InputLabel>
							<Select
								value={workerImageid}
								label="İşçi makine kalıp kalıbı"
								onChange={(e) =>
									setWorkerImageid(e.target.value)
								}
							>
								{customImages.map((x) => (
									<MenuItem key={x.id} value={x.id}>
										{x.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							InputProps={{ inputProps: { min: 1 } }}
							onChange={(e) =>
								setMasterCount(Number(e.target.value))
							}
							value={masterCount}
							type="number"
							label={translate("masterMachineCount")}
						/>
						<TextField
							InputProps={{ inputProps: { min: 1 } }}
							onChange={(e) =>
								setWorkerCount(Number(e.target.value))
							}
							value={workerCount}
							type="number"
							label={translate("workerMachineCount")}
						/>
					</Box>
				</Box>
			</Box>
		</Wrapper>
	);
}
