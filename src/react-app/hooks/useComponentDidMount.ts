import { useEffect } from "react";

export function useComponentDidMount(callback: Function) {
	useEffect(() => {
		(async () => {
			await callback();
		})();
	}, []);
}
