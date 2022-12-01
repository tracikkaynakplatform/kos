import React from "react";
import { TextField } from "@mui/material";
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
			render={({
				field: { onChange, ...others },
				fieldState: { error },
			}) => {
				return (
					<TextField
						{...others}
						fullWidth
						label={label}
						size={size}
						variant="outlined"
						error={!!error}
						onChange={(e) => {
							if (componentProps?.type === "number")
								onChange(+e.target.value);
							else onChange(e.target.value);
						}}
						helperText={error?.message}
						{...componentProps}
					/>
				);
			}}
			{...props}
		/>
	);
}
