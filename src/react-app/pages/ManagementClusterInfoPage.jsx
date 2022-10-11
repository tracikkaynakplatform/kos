import React, { useEffect, useState } from "react";

import {
	Box,
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
	Button,
	ButtonGroup,
	Fab,
} from "@mui/material";

import {
	Delete as DeleteIcon,
	Upgrade as UpgradeIcon,
	Camera as CameraIcon,
	Add as AddIcon,
	ArrowBack as ArrowBackIcon,
	Replay,
} from "@mui/icons-material";

import { providerNames } from "../providers/provider-names";
import { providerLogos } from "../providers/provider-logos";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { useSnackbar } from "notistack";

import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProviderChip from "../components/ProviderChip.jsx";
import LoadingModal from "../components/LoadingModal.jsx";
import QuestionModal from "../components/QuestionModal.jsx";
import clusterConfig from "../api/clusterConfig";
import kubeConfig from "../api/kubeConfig";
import kubectl from "../api/kubectl";

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

const StyledTableRow = styled(TableRow)(() => ({
	transition: "all 0.5s",
	"&:hover": {
		boxShadow: "0 0 13px -7px",
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
	const { enqueueSnackbar: snack, closeSnackbar } = useSnackbar();
	const { name } = useParams();
	const modal = useModal();
	const nav = useNavigate();

	const refreshClusters = async () => {
		modal.showModal(LoadingModal, { message: "Kümeler yükleniyor" });
		try {
			const _config = await kubeConfig.loadManagementConfig(name);
			await setConfig(_config);
			await setClusters([...(await clusterConfig.getClusters(_config))]);
		} catch (err) {
			snack(err.message, { variant: "error", autoHideDuration: 5000 });
		}
		modal.closeModal();
	};

	useEffect(() => {
		refreshClusters();
	}, []);

	return (
		<DashboardLayout>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					gap: "20px",
					p: 3,
				}}
			>
				<Box
					sx={{
						width: "100%",
						display: "flex",
					}}
				>
					<Fab
						color="primary"
						sx={{
							margin: 0,
							top: "auto",
							left: "auto",
						}}
						onClick={() => nav(-1)}
					>
						<ArrowBackIcon />
					</Fab>
				</Box>
				<Typography variant="h4">{name}</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						ml: 1,
						mr: 1,
					}}
				>
					<Typography
						sx={{
							fontSize: "18px",
						}}
					>
						İşyükü kümeleri
					</Typography>
					<Box
						sx={{
							display: "flex",
							gap: "20px",
							width: "400px",
							height: "40px",
						}}
					>
						<Button
							onClick={() => refreshClusters()}
							variant="contained"
						>
							<Replay />
						</Button>
						<Button
							sx={{
								textTransform: "none",
								fontSize: "18px",
								width: "350px",
							}}
							onClick={() => nav(`/create-cluster/${name}`)}
							variant="contained"
						>
							Yeni küme ekle <AddIcon />
						</Button>
					</Box>
				</Box>
				<TableContainer
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
					component={Paper}
				>
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
								<StyledTableRow key={i}>
									<StyledTableCell>{x.name}</StyledTableCell>
									<StyledTableCell>
										<ProviderChip
											name={providerNames[x.provider]}
											logo={providerLogos[x.provider]}
											status={x.status}
										/>
									</StyledTableCell>
									<StyledTableCell>
										{(() => {
											if (x.status === "Provisioning")
												return "Oluşturuluyor";
											if (x.status === "Provisioned")
												return "Hazır";
											if (x.status === "Deleting")
												return "Siliniyor";
										})()}
									</StyledTableCell>
									<StyledTableCell>
										<ButtonGroup variant="contained">
											<Button>
												<CameraIcon />
											</Button>
											<Button>
												<UpgradeIcon />
											</Button>
											<Button
												onClick={async () => {
													modal.showModal(
														QuestionModal,
														{
															yesButtonColor:
																"error",
															message: `${x.name} isimli kümeyi gerçekten silmek istiyor musunuz? (Bu işlem geri alınamaz)`,
															yesButtonText:
																"Sil",
															noButtonText:
																"Vazgeç",

															onYesClick:
																async () => {
																	modal.closeModal();
																	const info =
																		snack(
																			`"${x.name}" kümesi siliniyor`,
																			{
																				variant:
																					"info",
																				persist: true,
																			}
																		);
																	await kubectl.delete_(
																		config,
																		"cluster",
																		x.name
																	);
																	closeSnackbar(
																		info
																	);
																},
															onNoClick: () =>
																modal.closeModal(),
														}
													);
												}}
											>
												<DeleteIcon />
											</Button>
										</ButtonGroup>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</DashboardLayout>
	);
}
