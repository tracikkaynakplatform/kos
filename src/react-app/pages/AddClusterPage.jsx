import React from "react";
import { useNavigate } from "react-router-dom";
import AddClusterWizard from "../components/AddClusterWizard";
import TempLayout from "../layouts/TempLayout.jsx";

export default function AddClusterPage() {
	const nav = useNavigate();

	return (
		<TempLayout onClick={() => nav(-1)}>
			<AddClusterWizard />
		</TempLayout>
	);
}
