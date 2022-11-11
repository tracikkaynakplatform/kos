import React, { useState } from "react";
import InputString from "./InputString.jsx";

export default function InputNumber({ label, state, size, onChange }) {
	const [isValid, setIsValid] = useState(true);
	if (!!!state) state = useState("");
	return (
		<InputString
			error={!isValid}
			helperText={!isValid ? "Lütfen sayı giriniz" : undefined}
			label={label}
			state={state}
			InputProps={{ inputProps: { min: 1 } }}
			type="number"
			size={size}
			onChange={(e) => {
				if (!e.target.value) setIsValid(true);
				else setIsValid(/^\d+$/.test(e.target.value));
				onChange?.(e);
			}}
		/>
	);
}
