import React from "react";
import { Storage as StorageIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

function SidebarButton({ to, icon: Icon, label, isActive }) {
	const nav = useNavigate();
	console.log(isActive);
	return (
		<li
			className={`flex items-center gap-3 transition-all duration-300 hover:bg-gray-100 hover:cursor-pointer w-full p-3 ${
				isActive ? "bg-gray-100" : ""
			}`}
			onClick={() => nav(to, { replace: true })}
		>
			<Icon />
			<div>{label}</div>
		</li>
	);
}

export default function DashboardLayout({ children }) {
	const location = useLocation();
	console.log(location);
	return (
		<div className="flex">
			<div className="h-screen w-64 border-r-2 border-gray-200">
				<ul className="pt-5 flex flex-col w-full items-center">
					<SidebarButton
						to="/management-clusters"
						isActive={location.pathname == "/management-clusters"}
						icon={StorageIcon}
						label="Yönetim Kümeleri"
					/>
				</ul>
			</div>
			<div className="flex flex-col flex-grow h-screen">{children}</div>
		</div>
	);
}
