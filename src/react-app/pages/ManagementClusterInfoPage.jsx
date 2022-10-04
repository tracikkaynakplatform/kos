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
import ProviderChip from "../components/ProviderChip";
import { providerNames } from "../providers/provider-names";
import { providerLogos } from "../providers/provider-logos";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#033e8a",
		color: "white",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: "16px",
		textAlign: "center",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
	const nav = useNavigate();
	const { name } = useParams();
	useEffect(() => {
		(async () => {
			const config = await kubeConfig.loadManagementConfig(name);
			const _clusters = [...(await clusterConfig.getClusters(config))];
			await setClusters(_clusters);
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
		</DashboardLayout>
	);
}
