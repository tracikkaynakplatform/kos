/**
 * @typedef {Object} ProviderType
 * @property {Number} AWS
 * @property {Number} GCP
 * @property {Number} DIGITAL_OCEAN
 * @property {Number} DOCKER
 */

/**
 * @description Altyapı sağlayıcılarının ID numaraları. Yapılan tüm işlemler bu ID numaralarına göre yapılır.
 * @type {ProviderType}
 */
export const PROVIDER_TYPE = {
	AWS: 0,
	GCP: 1,
	DIGITAL_OCEAN: 2,
	DOCKER: 3,
};
