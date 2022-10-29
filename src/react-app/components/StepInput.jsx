import React, { useState } from "react";
import {
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	TextField,
	Grid,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormLabel,
} from "@mui/material";
import { useWizard } from "../hooks/useWizard";
import Wrapper from "./StepWizardWrapper.jsx";

export default function StepInput({
	onNextClick,
	onBackClick,
	fields,
	...props
}) {
	const extractOption = (obj, opt) =>
		typeof obj === "string" ? obj : obj[opt];

	const states = fields?.map((x) => {
		switch (x.type) {
			case "string":
				return useState(x.value ?? "");
			case "number":
				return useState(x.value ?? "1");
			case "select":
				return useState(x.values[0] ?? "");
			case "radio":
				return useState(extractOption(x.values[0] ?? "", "value"));
			default:
				return undefined;
		}
	});
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

			case "radio":
				items.push(
					<Grid item key={i} xs={x.size || 12}>
						<FormControl>
							<FormLabel>{x.title}</FormLabel>
							<RadioGroup
								row={
									x.direction === "horizontal"
										? true
										: undefined
								}
								/* defaultValue={
									x.values?.find(
										(l) => !!extractOption(l, "checked")
									)?.value
								} */
								onChange={(e) => {
									console.log(e.target.value);
									states[i][1](e.target.value);
								}}
							>
								{x.values?.map((y, k) => {
									return (
										<FormControlLabel
											key={k}
											control={<Radio />}
											value={extractOption(y, "value")}
											label={extractOption(y, "label")}
										/>
									);
								})}
							</RadioGroup>
						</FormControl>
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
									return (
										<MenuItem
											key={k}
											value={extractOption(y, "value")}
										>
											{extractOption(y, "label")}
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

	return (
		<Wrapper
			onBackClick={onBackClick}
			onNextClick={() => {
				let values = {};
				states.map((x, i) => {
					let name = fields[i].name ?? i;
					switch (fields[i].type) {
						case "string":
						case "radio":
						case "select":
							values[name] = x[0];
							break;
						case "number":
							values[name] = parseInt(x[0]);
							break;
					}
				});
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
