import React, { useEffect, useState } from "react";
import {
	Paper,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	styled,
	tableCellClasses,
	Tooltip,
} from "@mui/material";
import {
	Delete as DeleteIcon,
	Camera as CameraIcon,
	Add as AddIcon,
	Replay as ReplayIcon,
	Edit as EditIcon,
	Upgrade as UpgradeIcon,
} from "@mui/icons-material";
import { clusterConfig, kubeConfig, kubectl, clusterctl } from "../api";
import { providerNames, providerLogos } from "../providers";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { TempLayout } from "../layouts";
import { QuestionModal } from "../components/Modals";
import { Loading } from "../components/Snackbars";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import { Button, ProviderChip } from "../components/UI";
import { handleErrorWithSnack } from "../errorHandler";

const StyledTableCell = styled(TableCell)(() => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#033e8a",
		color: "white",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: "16px",
		textAlign: "center",
	},
}));

function HeaderCell({ children }) {
	return (
		<TableCell>
			<Typography
				sx={{
					fontWeight: "bold",
					fontSize: "18px",
					textDecoration: "italic",
					textAlign: "center",
				}}
			>
				{children}
			</Typography>
		</TableCell>
	);
}

export default function ManagementClusterInfoPage() {
	const [clusters, setClusters] = useState([]);
	const [config, setConfig] = useState("");
	const { enqueueSnackbar: snack, closeSnackbar } = useCustomSnackbar();
	const { name } = useParams();
	const modal = useModal();
	const nav = useNavigate();

	/* Handlers */
	const handleCopyClusterConfig = async (cluster) => {
		let copying = snack(
			`${name} yönetim kümesinin kubeconfig içeriği kopyalanıyor...`,
			{ persist: true },
			Loading
		);
		try {
			await navigator.clipboard.writeText(
				await clusterctl.getClusterConfig(config, cluster.name)
			);
			snack("Kümenin kubeconfig içeriği panoya kopyalandı!", {
				variant: "info",
				autoHideDuration: 4000,
			});
		} catch (err) {}
		setTimeout( () => closeSnackbar(copying), 1000);
		// closeSnackbar(copying);
	};
	const handleDeleteCluster = async (cluster) => {
		modal.showModal(QuestionModal, {
			yesButtonColor: "error",
			message: `${cluster.name} isimli kümeyi gerçekten silmek istiyor musunuz? (Bu işlem geri alınamaz)`,
			yesButtonText: "Sil",
			noButtonText: "Vazgeç",

			onYesClick: () => {
				modal.closeModal();
				snack(`"${cluster.name}" kümesi siliniyor`, {
					variant: "info",
					autoHideDuration: 4000,
				});
				handleErrorWithSnack(snack, async () => {
					kubectl.delete_(config, "cluster", cluster.name);
					await new Promise((res) =>
						clearTimeout(setTimeout(() => res(), 1000))
					);
					refreshClusters();
				});
			},
			onNoClick: () => modal.closeModal(),
		});
	};
	const handleUpgradeCluster = async (cluster) => {
		nav(`/upgrade-cluster/${name}/${cluster.name}`);
	};
	const handleEditCluster = async (cluster) => {
		nav(`/edit-cluster/${name}/${cluster.name}`);
	};	
	const handleDeleteManagementCluster = () => {
		modal.showModal(QuestionModal, {
			yesButtonColor: "error",
			message: `${name} isimli yönetim kümesini kaldırmak istediğinize emin misiniz? Eğer ilerleyen zamanlarda bu yönetim kümesini KOS ile birlikte kullanmak isterseniz tekrardan eklemeniz gerekecek.`,
			yesButtonText: "Sil",
			noButtonText: "Vazgeç",

			onYesClick: async () => {
				modal.closeModal();
				let loading = snack(
					`${name} yönetim kümesi siliniyor...`,
					{ persist: true },
					Loading
				);
				await handleErrorWithSnack(snack, async () => {
					await clusterConfig.deleteCluster(name);
					nav("/management-clusters", {
						replace: true,
					});
				});
				setTimeout( () => closeSnackbar(loading), 1000);
				// closeSnackbar(loading);
			},
			onNoClick: () => modal.closeModal(),
		});
	};

	const refreshClusters = async () => {
		let loading = snack("Kümeler yükleniyor", { persist: true, autoHideDuration: 4000 }, Loading);
		await handleErrorWithSnack(snack, async () => {
			const _config = await kubeConfig.loadManagementConfig(name);
			await setConfig(_config);
			await setClusters([...(await clusterConfig.getClusters(_config))]);
		});
		setTimeout( () => closeSnackbar(loading), 1000);
	};

	useEffect(() => {
		refreshClusters();
	}, []);

	return (
		<TempLayout>
			<div className="h-20" />
			<div className="flex justify-center flex-col gap-10 p-5">
				<div className="items-center flex justify-between">
					<h4 className="font-sans text-3xl">{name}</h4>
					<div className="flex gap-5">
						<Button
							variant="fab"
							onClick={handleDeleteManagementCluster}
						>
							<DeleteIcon />
						</Button>
						<Button
							variant="fab"
							onClick={() => nav(`/cluster/config/${name}`)}
						>
							<EditIcon />
						</Button>
					</div>
				</div>
				<div className="flex justify-between items-center ml-1 mr-1">
					<div className="font-sans">İşyükü kümeleri</div>
					<div className="flex gap-5 w-[400px] h-[40px]">
						<Button onClick={() => refreshClusters()}>
							<ReplayIcon />
						</Button>
						<Button
							className="flex-grow"
							onClick={() => nav(`/create-cluster/${name}`)}
						>
							Yeni küme ekle <AddIcon />
						</Button>
					</div>
				</div>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<HeaderCell>İsim</HeaderCell>
								<HeaderCell>Sağlayıcı</HeaderCell>
								<HeaderCell>Durum</HeaderCell>
								<HeaderCell>İşlemler</HeaderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{clusters.map((x, i) => (
								<TableRow key={i}>
									<StyledTableCell>{x.name}</StyledTableCell>
									<StyledTableCell>
										<ProviderChip
											name={providerNames[x.provider]}
											logo={providerLogos[x.provider]}
											status={x.status}
										/>
									</StyledTableCell>
									<StyledTableCell>
										{x.status === "Provisioning"
											? "Sağlanıyor"
											: x.status === "Provisioned"
											? "Hazırlandı"
											: x.status === "Deleting"
											? "Siliniyor"
											: "Bilinmiyor"}
									</StyledTableCell>
									<StyledTableCell
										sx={{
											display: "flex",
											gap: "5px",
											justifyContent: "center",
										}}
									>

										<Tooltip title="kubeconfig'i kopyala">
											<Button
												disabled={
													x.status !== "Provisioned"
												}
												onClick={() =>
													handleCopyClusterConfig(x)
												}
											>
												<CameraIcon />
											</Button>
										</Tooltip>

										<Tooltip title="düzenle">
											<Button
												disabled={
													x.status !== "Provisioned"
												}
												onClick={() =>
													handleEditCluster(x)
												}
											>
												<CameraIcon />
											</Button>
										</Tooltip>

										<Tooltip title="upgrade / downgrade">
											<Button
												disabled={
													x.status !== "Provisioned"
												}
												onClick={() =>
													handleUpgradeCluster(x)
												}
											>
												<UpgradeIcon />
											</Button>
										</Tooltip>

										<Tooltip title="Sil">
											<Button
												disabled={x.status === "Deleting"}
												onClick={() =>
													handleDeleteCluster(x)
												}
											>
												<DeleteIcon />
											</Button>
										</Tooltip>

									</StyledTableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</TempLayout>
	);
}
