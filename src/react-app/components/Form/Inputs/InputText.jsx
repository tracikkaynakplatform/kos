import React, { useState } from "react";
import { TextField } from "@mui/material";

export default function InputText({
	label,
	rows,
	state,
	size,
	onChange,
	...props
}) {
	if (!!!state) state = useState("");
	return (
		<TextField
			sx={{ width: "100%" }}
			label={label}
			value={state[0]}
			rows={rows || 5}
			onChange={(e) => {
				state[1](e.target.value);
				onChange?.(e);
			}}
			multiline
			variant="outlined"
			size={size}
			{...props}
		/>
	);
}
