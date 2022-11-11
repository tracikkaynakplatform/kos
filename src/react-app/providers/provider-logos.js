import { PROVIDER_TYPE } from ".";
import awsLogo from "../public/assets/images/logos/aws_32x32.png";
import awsEKSLogo from "../public/assets/images/logos/awseks_32x32.png";
import digitalOceanLogo from "../public/assets/images/logos/do_32x32.png";
import gcpLogo from "../public/assets/images/logos/gcp_32x32.png";
import dockerLogo from "../public/assets/images/logos/docker_32x32.png";

export const providerLogos = {
	[PROVIDER_TYPE.AWS]: awsLogo,
	[PROVIDER_TYPE.GCP]: gcpLogo,
	[PROVIDER_TYPE.DIGITAL_OCEAN]: digitalOceanLogo,
	[PROVIDER_TYPE.DOCKER]: dockerLogo,
	[PROVIDER_TYPE.AWS_EKS]: awsEKSLogo,
};
