import {
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import { useWizard } from ".";
import { translate } from "../../locales";
import Wrapper from "./Wrapper";

export default function StepKindProviderConfig(props) {
	const snack = useSnackbar().enqueueSnackbar;
	const closeSnack = useSnackbar().closeSnackbar;
	const wizard = useWizard();
	const [kubVersion, setKubVersion] = useState("");
	const [masterCount, setMasterCount] = useState(1);
	const [workerCount, setWorkerCount] = useState(1);
	const [clusterName, setClusterName] = useState("");
	const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			onNextClick={async () => {
				// TODO: docker kurulu mu diye kontrol et (çevre değişkenleri ile olabilir) #electronjs
				// TODO: clusterctl kurulu mu diye kontrol et (çevre değişkenleri ile olabilir) #electronjs
				try {
					await clusterctl.check();
				} catch (err) {
					const downloadSnack = snack(
						"clusterctl bulunamadı! İndiriliyor...", // TODO: snackbar yükleniyor tasarımında olacak.
						{ variant: "info", persist: true }
					);

					await clusterctl.download();
					closeSnack(downloadSnack);
				}
				snack("clusterctl çalıştırılıyor...", {
					variant: "info",
					autoHideDuration: 2000,
				});
				await clusterctl.setConfig(wizard.data.config);
				snack("Küme oluşturmak için yaml dosyası üretiliyor...", {
					variant: "info",
					autoHideDuration: 3000,
				});
				console.log(
					await clusterctl.generateCluster(
						clusterName,
						kubVersion,
						masterCount,
						workerCount,
						true
					)
				);
				snack("YAML dosyası üretildi", {
					variant: "success",
					autoHideDuration: 2000,
				});
				//_next();
			}}
			onBackClick={() => {
				_goto("selectProvider");
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
