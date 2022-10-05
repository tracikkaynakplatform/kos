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
} from "@mui/icons-material";

import { providerNames } from "../providers/provider-names";
import { providerLogos } from "../providers/provider-logos";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProviderChip from "../components/ProviderChip";
import LoadingModal from "../components/LoadingModal.jsx";

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

export default function ManagementClusterInfoPage(props) {
	const [clusters, setClusters] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");

	const nav = useNavigate();
	const { name } = useParams();
	useEffect(() => {
		(async () => {
			setLoading(true);
			setLoadingMessage("Kümeler yükleniyor");
			const config = await kubeConfig.loadManagementConfig(name);
			const _clusters = [...(await clusterConfig.getClusters(config))];

			for (let i = 0; i < _clusters.length; i++) {
				setLoadingMessage(
					`${_clusters[i].name} kümesinin master makine sayısı alınıyor`
				);
				const clusterConfig = await clusterctl.getClusterConfig(
					config,
					_clusters[i].name
				);
				_clusters[i].masterCount =
					(
						await kubectl.get(
							clusterConfig,
							"nodes",
							"json",
							"-l",
							"node-role.kubernetes.io/control-plane"
						)
					).items?.length ?? 0;

				setLoadingMessage(
					`${_clusters[i].name} kümesinin worker makine sayısı alınıyor`
				);

				_clusters[i].workerCount =
					(
						await kubectl.get(
							clusterConfig,
							"nodes",
							"json",
							"--selector",
							"!node-role.kubernetes.io/control-plane"
						)
					).items?.length ?? 0;
			}
			await setClusters(_clusters);
			setLoading(false);
		})();
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
					<Button
						sx={{
							textTransform: "none",
							fontSize: "18px",
						}}
						onClick={() => nav(`/create-cluster/${name}`)}
						variant="contained"
					>
						Yeni küme ekle <AddIcon />
					</Button>
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
								<HeaderCell>Worker Makine Sayısı</HeaderCell>
								<HeaderCell>Master Makine Sayısı</HeaderCell>
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
										/>
									</StyledTableCell>
									<StyledTableCell>
										{x.workerCount ?? "Bilinmiyor"}
									</StyledTableCell>
									<StyledTableCell>
										{x.masterCount ?? "Bilinmiyor"}
									</StyledTableCell>
									<StyledTableCell>
										<ButtonGroup variant="contained">
											<Button>
												<CameraIcon />
											</Button>
											<Button>
												<UpgradeIcon />
											</Button>
											<Button>
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
			<LoadingModal open={isLoading} message={loadingMessage} />
		</DashboardLayout>
	);
}
