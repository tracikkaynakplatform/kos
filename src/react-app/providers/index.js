import awsLogo from "../public/assets/images/logos/aws_32x32.png";
import awsEKSLogo from "../public/assets/images/logos/awseks_32x32.png";
import dockerLogo from "../public/assets/images/logos/docker_32x32.png";

export const PROVIDER_TYPE = {
	AWS: 0,
	DOCKER: 3,
	AWS_EKS: 4,
};

export const PROVIDER_CLASS = {
	[PROVIDER_TYPE.AWS]: "AWS",
	[PROVIDER_TYPE.DOCKER]: "Docker",
};

export const providerNames = {
	[PROVIDER_TYPE.AWS]: "AWS",
	[PROVIDER_TYPE.AWS_EKS]: "EKS",
	[PROVIDER_TYPE.DOCKER]: "Docker",
};

export const providerLogos = {
	[PROVIDER_TYPE.AWS]: awsLogo,
	[PROVIDER_TYPE.DOCKER]: dockerLogo,
	[PROVIDER_TYPE.AWS_EKS]: awsEKSLogo,
};
