import React from "react";
import { TextField } from "@mui/material";

export default function InputString({
	label,
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
			onChange={(e) => {
				state[1](e.target.value);
				onChange?.(e);
			}}
			variant="outlined"
			size={size}
			{...props}
		/>
	);
}
