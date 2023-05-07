export type APIFunction = (...args: any) => Promise<any>;
export type APIFunctionObject = {
	name: string;
	function: APIFunction;
};

export type API = {
	namespace: string;
	functions: APIFunctionObject[];
};
