import { useEffect, useState } from "react";

export function useViewModel() {
	const MAX_PERCENTAGE = 80;
	const MIN_PERCENTAGE = 45;
	const [value, setValue] = useState<number>(MAX_PERCENTAGE);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setValue(value === MAX_PERCENTAGE ? MIN_PERCENTAGE : MAX_PERCENTAGE);
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, [value]);

	return {
		value,
	};
}
