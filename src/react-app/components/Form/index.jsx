import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import InputCheckbox from "./Inputs/InputCheckbox.jsx";
import InputCheckboxGroup from "./Inputs/InputCheckboxGroup.jsx";
import InputNumber from "./Inputs/InputNumber.jsx";
import InputRadioGroup from "./Inputs/InputRadioGroup.jsx";
import InputSelect from "./Inputs/InputSelect.jsx";
import InputSelectCheckbox from "./Inputs/InputSelectCheckbox.jsx";
import InputString from "./Inputs/InputString.jsx";
import InputText from "./Inputs/InputText.jsx";
import { useForm } from "../../hooks/useForm.js";

function Section({ title, children, sx }) {
	return (
		<Box
			style={{
				display: "flex",
				flexDirection: "column",
				...sx,
			}}
		>
			<Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
				{title}
			</Typography>
			<br />
			<Grid container spacing={2}>
				{children}
			</Grid>
		</Box>
	);
}

function iterateFields(fields, operation) {
	const isKeyBased = !Array.isArray(fields) && typeof fields === "object";
	let keys = isKeyBased ? Object.keys(fields) : [];

	for (let i = 0; i < (isKeyBased ? keys : fields).length; i++) {
		let field = isKeyBased ? fields[keys[i]] : fields[i];
		let stateName = isKeyBased ? keys[i] : field?.name ?? i.toString();
		if (isKeyBased && !field?.notNested) field.name = keys[i];
		operation?.(field, stateName, i, isKeyBased);
	}
}

function parseFields(fields) {
	const items = [];
	let states = {};

	iterateFields(fields, (field, stateName, i) => {
		if (field?.state) states[stateName] = field?.state;
		else states[stateName] = useState(field?.value ?? "");

		switch (field?.type) {
			case "custom":
				if (!field?.name) delete states[stateName];
				const Element = field?.element;
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<Element state={states[stateName]} states={states} />
					</Grid>
				);
				break;
			case "section":
				const subItems = parseFields(field?.fields);
				if (field?.name) states[stateName] = subItems.states;
				else {
					delete states[stateName];
					states = {
						...states,
						...subItems.states,
					};
				}
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						{!!field?.title ? (
							<Section title={field?.title}>
								{subItems.items}
							</Section>
						) : (
							<Grid container spacing={2}>
								{subItems.items}
							</Grid>
						)}
					</Grid>
				);
				break;
			case "radio":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputRadioGroup
							state={states[stateName]}
							defaultValue={field?.value}
							items={field?.items}
							title={field?.title}
							direction={field?.direction}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "checkboxes":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputCheckboxGroup
							state={states[stateName]}
							defaultValues={field?.value}
							items={field?.items}
							title={field?.title}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "checkbox":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputCheckbox
							state={states[stateName]}
							defaultValue={field?.value}
							label={field?.title}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "text":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputString
							state={states[stateName]}
							label={field?.title}
							size={field?.fieldSize}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "textarea":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputText
							state={states[stateName]}
							label={field?.title}
							rows={field?.rows}
							size={field?.fieldSize}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "number":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						<InputNumber
							state={states[stateName]}
							label={field?.title}
							size={field?.fieldSize}
							onChange={field?.onChange}
						/>
					</Grid>
				);
				break;
			case "select":
				items.push(
					<Grid key={i} item xs={field?.size || 12}>
						{field?.variant === "checkbox" ? (
							<InputSelectCheckbox
								items={field?.items ?? ["None"]}
								state={states[stateName]}
								defaultValue={field?.value}
								label={field?.title}
								size={field?.fieldSize}
								onChange={field?.onChange}
							/>
						) : (
							<InputSelect
								items={field?.items ?? ["None"]}
								state={states[stateName]}
								defaultValue={field?.value}
								label={field?.title}
								size={field?.fieldSize}
								onChange={field?.onChange}
							/>
						)}
					</Grid>
				);
				break;
		}
	});

	return {
		items,
		states,
	};
}

export function parseValues(f, s) {
	let values = {};

	iterateFields(f, (field, stateName) => {
		if (field?.type === "section") {
			if (field?.name)
				values[stateName] = parseValues(field?.fields, s[stateName]);
			else
				values = {
					...values,
					...parseValues(field?.fields, s),
				};
		} else if (field?.name) values[stateName] = s[stateName][0];
	});
	return values;
}

export default function Form({ fields, buttons, style }) {
	const form = useForm();
	const { items, states } = parseFields(fields);
	form.states = states;
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				width: "100%",
				height: "100%",
				...style,
			}}
		>
			<Grid container spacing={2}>
				{items}
			</Grid>
			<div style={{ flexGrow: 1 }} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "10px",
					width: "100%",
				}}
			>
				{buttons?.map((x, i) => (
					<Button
						key={i}
						onClick={() => {
							x?.onClick?.(parseValues(fields, states));
						}}
						variant={x?.variant || "contained"}
					>
						{x?.text}
					</Button>
				))}
			</div>
		</div>
	);
}
