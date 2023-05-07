export interface ConfigurationField {
	label?: string;
	description?: string;
	value?: string;
}

export interface Configuration {
	[configurations: string]: ConfigurationField;
}

export function fillConfiguration(baseConfig: Configuration, values: any) {
	const config: Configuration = { ...baseConfig };
	for (const configField of Object.keys(values)) {
		if (config[configField]) {
			config[configField].value = values[configField];
		}
	}
	return config;
}
