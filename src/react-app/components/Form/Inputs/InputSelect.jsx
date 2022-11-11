import React from "react";
import { getField } from "./utils";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function InputSelect({
	label,
	state,
	defaultValue,
	size,
	items,
	onChange,
}) {
	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select
				defaultValue={defaultValue}
				value={state[0]}
				size={size}
				label={label}
				onChange={(e) => {
					state[1](e.target.value);
					onChange?.(e);
				}}
			>
				{items?.map?.((x, i) => (
					<MenuItem value={getField(x, "value")} key={i}>
						{getField(x, "label")}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
