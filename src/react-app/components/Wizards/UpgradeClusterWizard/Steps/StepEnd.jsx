import React from "react";
import { Typography } from "@mui/material";
import { StepWizardWrapper } from "../../../Steps";

export default function StepEnd({ onFinish, ...props }) {
	return (
		<StepWizardWrapper
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
			<div className="flex justify-center items-center flex-col gap-3 w-[500px] mb-[10px]">
				<Typography>
					Küme yükseltme işlemi başarıyla sonuçlandı. Kümenin
					yükseltme durumuyla ilgili bilgiyi detay sayfasından
					alabilirsiniz.
				</Typography>
			</div>
		</StepWizardWrapper>
	);
}
