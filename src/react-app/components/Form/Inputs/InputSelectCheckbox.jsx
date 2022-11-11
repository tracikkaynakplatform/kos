import {
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import React, { useState } from "react";

export default function InputSelectCheckbox({ items, state, onChange, label }) {
	const [selections, setSelections] = useState([]);
	if (!!!state) state = useState("");

	const handleChange = (e) => {
		const value =
			typeof e.target.value === "string"
				? e.target.value.split(",")
				: e.target.value;
		setSelections(value);
		state[1](value);
		onChange?.(value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select
				multiple
				value={selections}
				onChange={handleChange}
				input={<OutlinedInput label={label} />}
				renderValue={(selected) => selected.join(", ")}
			>
				{items.map((x, i) => (
					<MenuItem key={i} value={x}>
						<Checkbox checked={selections.indexOf(x) > -1} />
						<ListItemText primary={x} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
