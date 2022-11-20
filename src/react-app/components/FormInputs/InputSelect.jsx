import React from "react";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function InputSelect({
	name,
	defaultValue = "",
	control,
	label,
	items,
	...props
}) {
	return (
		<Controller
			defaultValue={defaultValue}
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => {
				console.log(error);
				return (
					<FormControl fullWidth error={!!error}>
						<InputLabel>{label}</InputLabel>
						<Select {...field} label={label}>
							{items.map((p, i) => {
								let label, value;
								if (typeof p === "string") {
									label = p;
									value = p;
								} else if (typeof p === "object") {
									value = p.value;
									label = p.label;
								}
								return (
									<MenuItem key={i} value={value}>
										{label}
									</MenuItem>
								);
							})}
						</Select>
						{!!error && (
							<FormHelperText>{error.message}</FormHelperText>
						)}
					</FormControl>
				);
			}}
			{...props}
		/>
	);
}
