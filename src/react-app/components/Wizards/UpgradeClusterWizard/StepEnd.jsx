import React from "react";
import { Typography, Box } from "@mui/material";
import Wrapper from "../../Steps/StepWizardWrapper.jsx";

export default function StepEnd({ onFinish, ...props }) {
	return (
		<Wrapper
			disableBack
			onNextClick={async () => {
				onFinish?.();
			}}
			{...props}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Yükseltme tamamlandı
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					gap: "10px",
					width: "500px",
					mb: "10px",
				}}
			>
				<Typography>
					Küme yükseltme işlemi başarıyla sonuçlandı. Kümenin
					yükseltme durumuyla ilgili bilgiyi detay sayfasından
					alabilirsiniz.
				</Typography>
			</Box>
		</Wrapper>
	);
}
