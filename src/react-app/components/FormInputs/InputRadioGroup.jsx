import React from "react";
import { Controller } from "react-hook-form";
import {
	Typography,
	Radio,
	RadioGroup,
	FormHelperText,
	FormControlLabel,
} from "@mui/material";

export default function InputRadioGroup({
	name,
	control,
	options,
	defaultValue,
	...other
}) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({ field, fieldState: { error } }) => (
				<div>
					<RadioGroup {...field} row {...other}>
						{options.map((option) => (
							<div
								key={option?.value ?? option}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "5px",
								}}
							>
								<Radio value={option?.value ?? option} />
								<Typography>
									{option?.label ?? option}
								</Typography>
							</div>
						))}
					</RadioGroup>

					{!!error && (
						<FormHelperText error sx={{ px: 2 }}>
							{error.message}
						</FormHelperText>
					)}
				</div>
			)}
		/>
	);
}
