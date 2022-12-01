import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateClusterWizard } from "../components/Wizards";
import { TempLayout } from "../layouts";

export default function CreateClusterPage() {
	const nav = useNavigate();
	const { manClusterName } = useParams();

	return (
		<TempLayout onBackClicked={() => nav(-1)}>
			<CreateClusterWizard
				onFinish={() => {
					nav("/management-clusters");
				}}
				manClusterName={manClusterName}
			/>
		</TempLayout>
	);
}
