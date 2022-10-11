import React from "react";
import { Typography, Box } from "@mui/material";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepAddClusterComplete({ onFinish, ...props }) {
	return (
		<Wrapper
			onNextClick={() => {
				onFinish();
			}}
			disableBack
			{...props}
			sx={{
				width: "500px",
			}}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Küme oluşturma başarılı.
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Typography>
					Küme oluşturma işlemi başarıyla sonuçlandı. Oluşturduğunuz
					kümenin hazır olup olmadığını kümeler menüsünden takip
					edebilirsiniz. [Sihirbaz sonlanır]
				</Typography>
			</Box>
		</Wrapper>
	);
}
