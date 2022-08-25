import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateClusterWizard from '../components/CreateClusterWizard';

export default function Main(props) {
	return (
		<DashboardLayout>
			<CreateClusterWizard />
		</DashboardLayout>
	);
}