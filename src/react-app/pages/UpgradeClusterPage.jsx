import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpgradeClusterWizard from "../components/UpgradeClusterWizard";
import TempLayout from "../layouts/TempLayout.jsx";

export default function UpgradeClusterPage() {
	const nav = useNavigate();
	const { manClusterName, clusterName } = useParams();

	return (
		<TempLayout onBackClicked={() => nav(-1)}>
			<UpgradeClusterWizard
				onError={() => nav(-1)}
				onFinish={() => {
					nav(-1);
				}}
				manClusterName={manClusterName}
				clusterName={clusterName}
			/>
		</TempLayout>
	);
}
