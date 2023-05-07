import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { InputSelectProps } from "./types";

export function useViewModel(props: InputSelectProps) {
	const { control, setValue } = useFormContext();

	useEffect(() => {
		if (props.options?.length == 0) {
			setValue(props.name, null);
		} else {
			setValue(props.name, props.options?.[0] ?? null);
		}
	}, [props.options]);

	return {
		control,
	};
}
