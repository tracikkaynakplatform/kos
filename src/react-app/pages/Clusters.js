import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import CustomizedTables from "../components/TableComponent/TableComponent";
import SmallPieChart from "../components/TableComponent/SmallPieChart";
import { rows } from "../components/TableComponent/TableComponent"

export default function Clusters(props) {
	return (
		<DashboardLayout>
			Merhaba kümeler!
			<CustomizedTables rows={rows}/>
		</DashboardLayout>
	);
}

