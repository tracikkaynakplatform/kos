import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function InputCheckbox({
	label,
	state,
	defaultValue,
	onChange,
}) {
	if (!!!state) state = useState(defaultValue ?? false);
	return (
		<FormControlLabel
			control={<Checkbox defaultChecked={defaultValue} />}
			onChange={(e) => {
				state[1](e.target.checked);
				onChange?.(e);
			}}
			label={label}
			value={state[0]}
		/>
	);
}
