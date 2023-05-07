export interface SelectOption {
	id: number | string;
	label: string;
	value: any;
	icon?: string;
}

export interface SelectProps {
	options: SelectOption[];
	value?: SelectOption;
	label?: string;
	defaultValue?: SelectOption;
	isLoading?: boolean;
	onChange?: (value: SelectOption) => void;
}
