import React from "react";
import { Card, Typography, Box, Divider, Link as MUILink } from "@mui/material";
import { providerNames } from "../providers/provider-names";
import { providerLogos } from "../providers/provider-logos";
import { Link } from "react-router-dom";
import ProviderChip from "./ProviderChip.jsx";

export default function ManagementClusterCard({
	name,
	clusters,
	href,
	supportedProviders,
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
			<MUILink component={Link} to={href} m={2} underline="hover">
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
						flexWrap: "wrap",
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
							name={x.name}
							logo={providerLogos[x.provider]}
							href={x.href}
							status={x.status}
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
