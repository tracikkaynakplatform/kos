import React from "react";
import { Controller } from "react-hook-form";
import {
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
							<FormControlLabel
								key={option?.value ?? option}
								label={option?.label ?? option}
								value={option?.value ?? option}
								control={<Radio />}
							/>
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
