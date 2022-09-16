import _do from "./digitalocean";

export const PROVIDER_TYPE = {
	AWS: 0,
	GCP: 1,
	DIGITAL_OCEAN: 2,
	DOCKER: 3,
};

export const digitalocean = _do;
