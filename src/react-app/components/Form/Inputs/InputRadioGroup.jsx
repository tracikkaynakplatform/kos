import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getField } from "./utils";

export default function InputRadioGroup({
	items,
	defaultValue,
	state,
	title,
	direction,
	onChange,
}) {
	if (!!!state) state = useState("");
	return (
		<>
			{!!title ? (
				<Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
					{title}
				</Typography>
			) : null}
			<br />
			<RadioGroup
				sx={{ flexDirection: direction ?? "row" }}
				defaultValue={defaultValue}
				onChange={(e) => {
					state[1](e.target.value);
					onChange?.(e);
				}}
			>
				{items?.map?.((x, i) => (
					<FormControlLabel
						key={i}
						control={<Radio />}
						value={getField(x, "value")}
						label={getField(x, "label")}
					/>
				))}
			</RadioGroup>
		</>
	);
}
