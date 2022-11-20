import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

export default function InputText({
	name,
	defaultValue = "",
	size,
	control,
	label,
	componentProps,
	...props
}) {
	return (
		<Controller
			defaultValue={defaultValue}
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => {
				return (
					<TextField
						{...field}
						fullWidth
						label={label}
						size={size}
						variant="outlined"
						error={!!error}
						helperText={error?.message}
						{...componentProps}
					/>
				);
			}}
			{...props}
		/>
	);
}
