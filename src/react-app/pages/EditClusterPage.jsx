import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateClusterWizard } from "../components/Wizards";
import { TempLayout } from "../layouts";

export default function EditClusterPage() {
	const nav = useNavigate();
	const { manClusterName, clusterName } = useParams();

	return (
		<TempLayout>
			<CreateClusterWizard
				onFinish={() => {
					nav("/management-clusters");
				}}
				manClusterName={manClusterName}
				clusterName={clusterName}
			/>
		</TempLayout>
	);
}
