import React from "react";
import unknownLogo from "../public/assets/images/logos/unknown_32x32.png";
import { Avatar, Badge, Chip } from "@mui/material";

export default function ProviderChip({ logo, name, status, href }) {
	let badgeColor = "success";

	switch (status) {
		case "Provisioning":
			badgeColor = "warning";
			break;
		case "Deleting":
			badgeColor = "error";
			break;
	}
	const inner = (
		<Chip
			href={href}
			avatar={
				<Avatar
					sx={{
						width: "32px",
						height: "32px",
					}}
					src={logo ?? unknownLogo}
				/>
			}
			label={name}
			variant={"outlined"}
			clickable={!!href}
		/>
	);
	return status ? (
		<Badge
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			variant="dot"
			color={badgeColor}
		>
			{inner}
		</Badge>
	) : (
		inner
	);
}
