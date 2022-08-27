import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateClusterWizard from "../components/CreateClusterWizard";

export default function App(props) {
    return (
        <DashboardLayout>
            <CreateClusterWizard />
        </DashboardLayout>
    );
}
