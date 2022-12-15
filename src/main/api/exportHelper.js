export function exportHelper(name, func) {
	return {
		name,
		api: func,
	};
}
