import React, { forwardRef } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { SnackbarContent } from "notistack";

export const Loading = forwardRef(({ message }, ref) => {
	return (
		<SnackbarContent ref={ref}>
			<Card
				sx={{
					backgroundColor: "#EAF750",
					width: "100%",
				}}
			>
				<CardContent
					sx={{ display: "flex", gap: "30px", alignItems: "center" }}
				>
					<CircularProgress size="20px" />
					<Typography>{message}</Typography>
				</CardContent>
			</Card>
		</SnackbarContent>
	);
});

export default Loading;
