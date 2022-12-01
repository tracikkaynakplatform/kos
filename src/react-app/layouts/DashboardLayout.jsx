import React from "react";
import { Storage as StorageIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SidebarButton({ to, icon: Icon, label }) {
	const nav = useNavigate();
	return (
		<li
			className="flex items-center gap-3 transition-all duration-300 hover:bg-gray-100 hover:cursor-pointer w-full p-3"
			onClick={() => nav(to, { replace: true })}
		>
			<Icon />
			<div>{label}</div>
		</li>
	);
}

export function DashboardLayout({ children }) {
	return (
		<div className="flex">
			<div className="h-screen w-64 border-r-2 border-gray-200">
				<ul className="pt-5 flex flex-col w-full items-center">
					<SidebarButton
						to="/"
						icon={StorageIcon}
						label="Yönetim Kümeleri"
					/>
				</ul>
			</div>
			<div className="flex flex-col flex-grow h-screen">{children}</div>
		</div>
	);
}
