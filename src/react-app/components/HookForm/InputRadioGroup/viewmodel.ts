import { useFormContext } from "react-hook-form";
import { InputRadioGroupProps } from "./types";

export function useViewModel(props: InputRadioGroupProps) {
	const { control } = useFormContext();

	const handleChange = (value: string, setField: (...event: any) => void) => {
		setField(value);
	};
	return {
		control,
		handleChange,
	};
}
