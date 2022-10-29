import React, { createRef, useState } from "react";
import {
	Box,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	TextField,
	Typography,
	Grid,
} from "@mui/material";
import { useWizard } from "../hooks/useWizard";
import Wrapper from "./StepWizardWrapper.jsx";

export default function StepInput({
	onNextClick,
	onBackClick,
	fields,
	...props
}) {
	const states = fields?.map((x) =>
		x.type === "string"
			? useState(x.value ?? "")
			: x.type === "number"
			? useState("1")
			: x.type === "select"
			? useState(x.values[0] ?? "")
			: undefined
	);
	const items = [];
	for (let i = 0; i < fields.length; i++) {
		let x = fields[i];
		switch (x.type) {
			case "string":
				items.push(
					<Grid item key={i} xs={x.size || 12}>
						<TextField
							value={states[i][0]}
							onChange={(e) => states[i][1](e.target.value)}
							fullWidth
							label={x.title}
						/>
					</Grid>
				);
				break;
			case "number":
				items.push(
					<Grid item key={i} xs={x.size || 12}>
						<TextField
							fullWidth
							value={states[i][0]}
							onChange={(e) => states[i][1](e.target.value)}
							InputProps={{ inputProps: { min: 1 } }}
							type="number"
							label={x.title}
						/>
					</Grid>
				);
				break;

			case "select":
				items.push(
					<Grid item key={i} xs={x.size || 12}>
						<FormControl fullWidth>
							<InputLabel>{x.title}</InputLabel>
							<Select
								label={x.title}
								value={states[i][0]}
								onChange={(e) => {
									states[i][1](e.target.value);
								}}
							>
								{x.values.map((y, k) => {
									let text, value;
									if (typeof y === "string") {
										text = y;
										value = y;
									} else if (typeof y === "object")
										(text = y.text), (value = y.value);

									return (
										<MenuItem key={k} value={value}>
											{text}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Grid>
				);
				break;
		}
	}

	const [a, se] = useState("");

	return (
		<Wrapper
			onBackClick={onBackClick}
			onNextClick={() => {
				let values = {};
				states.map((x, i) => {
					switch (fields[i].type) {
						case "string":
						case "select":
							values[fields[i].name] = x[0];
							break;
						case "number":
							values[fields[i].name] = parseInt(x[0]);
							break;
					}
				});
				console.log(values);
				onNextClick?.(values);
			}}
			{...props}
		>
			<Grid container spacing={1}>
				{items}
			</Grid>
		</Wrapper>
	);
}
