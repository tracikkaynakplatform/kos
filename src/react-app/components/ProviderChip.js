import React from "react";
import { Avatar, Badge, Chip } from "@mui/material";

export default function ProviderChip({
	logo,
	name,
	count,
	href,
	variant,
	sx,
	badgeColor,
}) {
	let innerItems = logo ? (
		<Chip
			sx={sx}
			href={href}
			avatar={
				<Avatar
					sx={{
						width: "32px",
						height: "32px",
					}}
					src={logo}
				/>
			}
			label={name}
			variant={variant ?? "outlined"}
			clickable={!!href}
		/>
	) : null;

	return (
		<>
			{count ? (
				<Badge
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					badgeContent={count ?? ""}
					color={badgeColor ?? "primary"}
				>
					{innerItems}
				</Badge>
			) : (
				innerItems
			)}
		</>
	);
}
