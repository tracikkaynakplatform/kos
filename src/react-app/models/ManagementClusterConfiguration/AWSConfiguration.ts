import { Configuration } from ".";

export const AWSConfiguration: Configuration = {
	AWS_REGION: {
		description: "Specifies which region will be used for cluster creation.",
		label: "Region",
	},
	AWS_ACCESS_KEY_ID: {
		label: "Access Key",
	},
	AWS_SECRET_ACCESS_KEY: {
		label: "Secret Access Key",
	},
};
