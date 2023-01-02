import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import { clusterConfig } from "../api";
import { DashboardLayout } from "../layouts";
import { ManagementClusterCard, Button } from "../components/UI";
import { Loading } from "../components/Snackbars";

export default function ManagementClustersPage() {
	const [clusters, setClusters] = useState([]);
	const nav = useNavigate();
	const { enqueueSnackbar: snack, closeSnackbar } = useCustomSnackbar();

	useEffect(() => {
		(async () => {
			let loading = snack(
				"Yönetim kümeleri yükleniyor",
				{ persist: true },
				Loading
			);
			try {
				await setClusters(await clusterConfig.getManagementClusters());
			} catch (err) {
				snack(err.message, {
					variant: "error",
					autoHideDuration: 5000,
				});
			}
			closeSnackbar(loading);
		})();
	}, []);

	return (
		<DashboardLayout>
			<h1 className="w-full m-5 text-[30px] font-bold text-center">
				Yönetim Kümeleri
			</h1>
			<Button
				className="fixed left-auto top-auto bottom-5 right-5 m-0 h-16 w-16"
				variant="fab"
				onClick={() => nav("/add-cluster")}
			>
				<AddIcon />
			</Button>
			<div className="flex flex-col">
				{clusters.length > 0 && clusters[0] != null ? (
					<div className="flex flex-wrap gap-[12px] m-3">
						{clusters.map((x, i) => (
							<ManagementClusterCard
								key={i}
								href={`/cluster/${x.name}`}
								{...x}
							/>
						))}
					</div>
				) : (
					<div className="w-full m-5 text-[20px] italic text-center">
						{clusters[0] == null
							? "Hiç yönetim kümesi eklemediniz."
							: "Yükleniyor..."}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
