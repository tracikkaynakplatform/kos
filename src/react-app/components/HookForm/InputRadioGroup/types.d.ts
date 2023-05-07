export interface RadioGroupOption {
	label: string;
	value: any;
	checked?: boolean;
}

export interface InputRadioGroupProps {
	name: string;
	label?: string;
	options: RadioGroupOption[];
}
