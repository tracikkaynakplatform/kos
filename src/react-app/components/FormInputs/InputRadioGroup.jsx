import { Controller } from "react-hook-form";
import {
	Typography,
	Radio,
	RadioGroup,
	FormHelperText,
	FormControlLabel,
} from "@mui/material";

export default function InputRadioGroup({ name, control, options, ...other }) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div>
					<RadioGroup {...field} row {...other}>
						{options.map((option) => (
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
