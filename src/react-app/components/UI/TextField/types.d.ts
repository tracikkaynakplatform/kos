import { CSSProperties, ChangeEvent, FocusEventHandler } from "react";

export interface TextFieldProps {
	style?: CSSProperties;
	rows?: number;
	cols?: number;
	value?: string;
	label?: string;
	name?: string;
	type?: "number" | undefined;
	defaultValue?: string;
	className?: string;
	onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}
