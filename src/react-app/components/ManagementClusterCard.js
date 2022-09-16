import React from "react";
import { Card, Typography, Box, Divider, Link as MUILink } from "@mui/material";
import ProviderChip from "./ProviderChip";
import { providerNames } from "../providers/provider-names";
import { providerLogos } from "../providers/provider-logos";

export default function ManagementClusterCard({
	name,
	provider,
	clusters,
	href,
	supportedProviders,
	...props
}) {
	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: "column",
				width: "325px",
				height: "300px",
			}}
		>
			<MUILink m={2} underline="hover" href={href ?? "#"}>
				<Typography
					sx={{
						fontSize: "20px",
						fontWeight: "bold",
						color: "black",
					}}
				>
					{name}
				</Typography>
			</MUILink>
			<Divider />
			<Box
				sx={{
					flexGrow: 1,
					p: 2,
				}}
			>
				<Typography mb={1}>Desteklenen Altyapılar</Typography>
				<Box
					sx={{
						display: "flex",
						flexWrap: "normal",
						overflow: "auto",
						gap: "10px",
					}}
				>
					{supportedProviders?.map((x, i) => (
						<ProviderChip
							key={i}
							name={providerNames[x]}
							logo={providerLogos[x]}
						/>
					)) ?? <Typography>Yok</Typography>}
				</Box>
			</Box>
			<Divider />
			<Box
				sx={{
					p: 2,
					overflowY: "auto",
				}}
			>
				<Typography mb={1}>Kümeler</Typography>
				{clusters && clusters.length > 0 ? (
					clusters?.map((x, i) => (
						<ProviderChip
							key={i}
							sx={{ mt: 0.5, mb: 0.5, ml: 0.3, mr: 0.3 }}
							name={`cluster-${providerNames[x.type]}-${i}`}
							logo={providerLogos[x.type]}
							href={x.href}
						/>
					))
				) : (
					<Typography
						sx={{
							width: "100%",
							textAlign: "center",
							alignItems: "center",
							fontStyle: "italic",
						}}
					>
						Henüz küme oluşturulmamış...
					</Typography>
				)}
			</Box>
		</Card>
	);
}
