import React from "react";
import Wrapper from "./StepWizardWrapper.jsx";
import Form, { parseValues } from "./Form/index.jsx";
import { FormProvider, useForm } from "../hooks/useForm.js";

function Content({ onNextClick, onBackClick, fields, ...props }) {
	const form = useForm();
	return (
		<Wrapper
			onBackClick={onBackClick}
			onNextClick={() => {
				onNextClick?.(parseValues(fields, form.states));
			}}
			{...props}
		>
			<Form fields={fields} />
		</Wrapper>
	);
}

export default function StepInput({
	onNextClick,
	onBackClick,
	fields,
	...props
}) {
	return (
		<FormProvider>
			<Content
				onNextClick={onNextClick}
				onBackClick={onBackClick}
				fields={fields}
				{...props}
			/>
		</FormProvider>
	);
}
