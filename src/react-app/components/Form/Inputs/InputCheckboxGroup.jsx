import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

export default function InputCheckboxGroup({
	items,
	defaultValues,
	title,
	state,
	onChange,
}) {
	if (!!!state) state = useState([]);
	useEffect(() => {
		let initialValues = [];
		for (let i = 0; i < defaultValues?.length ?? 0; i++)
			if (defaultValues[i]) initialValues.push(items[i]);
		state[1](initialValues);
	}, []);
	return (
		<>
			{!!title ? (
				<Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
					{title}
				</Typography>
			) : null}
			<br />
			<div style={{ display: "flex", gap: "10px" }}>
				{items.map((x, i) => (
					<FormControlLabel
						control={
							<Checkbox
								defaultChecked={
									Array.isArray(defaultValues)
										? defaultValues[i]
										: undefined
								}
							/>
						}
						onChange={(e) => {
							let data = Array.isArray(state[0]) ? state[0] : [];
							let newSelections = [...data];
							let index = newSelections.indexOf(x);
							if (index == -1 && e.target.checked)
								newSelections.push(x);
							else if (index > -1 && !e.target.checked) {
								newSelections = newSelections.filter(
									(_, k) => k != index
								);
							}
							state[1](newSelections);
							onChange?.(newSelections);
						}}
						key={i}
						label={x}
					/>
				))}
			</div>
		</>
	);
}
