import { PROVIDER_TYPE } from ".";
import awsLogo from "../public/assets/images/logos/aws_32x32.png";
import digitalOceanLogo from "../public/assets/images/logos/do_32x32.png";
import gcpLogo from "../public/assets/images/logos/gcp_32x32.png";
import dockerLogo from "../public/assets/images/logos/docker_32x32.png";
import unknownLogo from "../public/assets/images/logos/unknown_32x32.png";

export const providerLogos = {};

providerLogos[PROVIDER_TYPE.AWS] = awsLogo;
providerLogos[PROVIDER_TYPE.GCP] = gcpLogo;
providerLogos[PROVIDER_TYPE.DIGITAL_OCEAN] = digitalOceanLogo;
providerLogos[PROVIDER_TYPE.DOCKER] = dockerLogo;
