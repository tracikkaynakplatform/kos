import _do from "./digitalocean";
import awsLogo from "../public/assets/images/logos/aws_32x32.png";
import awsEKSLogo from "../public/assets/images/logos/awseks_32x32.png";
import digitalOceanLogo from "../public/assets/images/logos/do_32x32.png";
import gcpLogo from "../public/assets/images/logos/gcp_32x32.png";
import dockerLogo from "../public/assets/images/logos/docker_32x32.png";

export const PROVIDER_TYPE = {
	AWS: 0,
	GCP: 1,
	DIGITAL_OCEAN: 2,
	DOCKER: 3,
	AWS_EKS: 4,
};

export const PROVIDER_CLASS = {
	[PROVIDER_TYPE.AWS]: "AWS",
	[PROVIDER_TYPE.DOCKER]: "Docker",
};

export const digitalocean = _do;

export const providerNames = {
	[PROVIDER_TYPE.AWS]: "AWS",
	[PROVIDER_TYPE.AWS_EKS]: "EKS",
	[PROVIDER_TYPE.GCP]: "GCloud",
	[PROVIDER_TYPE.DIGITAL_OCEAN]: "DigitalOcean",
	[PROVIDER_TYPE.DOCKER]: "Docker",
};

export const providerLogos = {
	[PROVIDER_TYPE.AWS]: awsLogo,
	[PROVIDER_TYPE.GCP]: gcpLogo,
	[PROVIDER_TYPE.DIGITAL_OCEAN]: digitalOceanLogo,
	[PROVIDER_TYPE.DOCKER]: dockerLogo,
	[PROVIDER_TYPE.AWS_EKS]: awsEKSLogo,
};
