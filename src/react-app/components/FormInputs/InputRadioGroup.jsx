<<<<<<< HEAD
import React from "react";
=======
>>>>>>> upgrade-wizard
import { Controller } from "react-hook-form";
import {
	Typography,
	Radio,
	RadioGroup,
	FormHelperText,
	FormControlLabel,
} from "@mui/material";

<<<<<<< HEAD
export default function InputRadioGroup({
	name,
	control,
	options,
	defaultValue,
	...other
}) {
=======
export default function InputRadioGroup({ name, control, options, ...other }) {
>>>>>>> upgrade-wizard
	return (
		<Controller
			name={name}
			control={control}
<<<<<<< HEAD
			defaultValue={defaultValue}
=======
>>>>>>> upgrade-wizard
			render={({ field, fieldState: { error } }) => (
				<div>
					<RadioGroup {...field} row {...other}>
						{options.map((option) => (
<<<<<<< HEAD
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
=======
							<FormControlLabel
								key={option?.value ?? option}
								value={option?.value ?? option}
								control={<Radio />}
								label={
									<Typography variant="caption">
										{option?.label ?? option}
									</Typography>
								}
							/>
>>>>>>> upgrade-wizard
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
