import React from "react";
import { useNavigate } from "react-router-dom";
import { TempLayout } from "../layouts";
import { AddClusterWizard } from "../components/Wizards";

export default function AddClusterPage() {
	const nav = useNavigate();

	return (
		<TempLayout onBackClicked={() => nav(-1)}>
			<AddClusterWizard />
		</TempLayout>
	);
}
