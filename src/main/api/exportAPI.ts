import { APIFunction, APIFunctionObject } from "./types..dts";

export function exportAPI(name: string, apiFunction: APIFunction): APIFunctionObject {
	return {
		name,
		function: apiFunction,
	};
}
