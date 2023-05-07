/// It has been wrote by ChatGPT.
export function jsonPath(json: any, path: string, value?: any): any {
	const keys = path.split(".");
	let obj = json;
	let i;

	for (i = 0; i < keys.length - 1; i++) {
		obj = obj[keys[i]];
	}

	if (value !== undefined) {
		obj[keys[i]] = value;
		return json;
	} else {
		return obj[keys[i]];
	}
}
