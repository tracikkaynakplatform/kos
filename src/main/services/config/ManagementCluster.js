import Kubectl from "../Kubectl";
import { KubeConfig } from "../../k8s/KubeConfig";
import { dirCheck, DIRS } from "../../utils/dir-check";
import { PROVIDER_TYPE } from "../../providers";
import { readdir } from "fs";

/**
 * Represents a cluster.
 * @typedef		{Object} Cluster
 * @property	{String} name		Name of the cluster.
 * @property	{String} status		Current state of cluster. "Provisioned", "Provisioning", "Deleting" etc.
 * @property	{Number} provider	Provider of the cluster.
 * @see PROVIDER_TYPE
 */

/**
 * Represents a management cluster and do stuff with it.
 */
export default class ManagementCluster {
	/**
	 * Instantiate a new ManagementCluster object with given parameters.
	 * @param {String} name	Management cluster name that will be using with clusterctl.
	 */
	constructor(name) {
		/**
		 * @property Name of the management cluster.
		 * @type {string}
		 */
		this.name = name ?? "";

		/**
		 * @property Supported providers by management cluster.
		 * @see {@link ProviderType}
		 * @type {Array<Number>}
		 */
		this.supportedProviders = [];

		/**
		 * @property List of clusters those owned by this managemenet cluster.
		 * @type {Array<Cluster>}
		 * @see PROVIDER_TYPE
		 */
		this.clusters = [];

		/**
		 * @property KubeConfig object that will be used at clusterctl.
		 * @type {KubeConfig}
		 */
		this.config = new KubeConfig();
	}

	/**
	 * Gets cluster list in the management cluster and put them into `clusters`.
	 * @returns {Promise<Array<Cluster>>}	`clusters`
	 */
	async getClusters() {
		let kctl = new Kubectl();
		let result = [];
		await KubeConfig.tempConfig(
			kctl.config,
			this.config.config,
			async () => {
				let clusterList = await kctl.get("cluster", "", {
					outputType: "json",
				});
				clusterList = clusterList?.items;

				for (let i of clusterList) {
					let provider = i.spec.infrastructureRef.kind;
					switch (provider) {
						case "DockerCluster":
							provider = PROVIDER_TYPE.DOCKER;
							break;
						case "DOCluster":
							provider = PROVIDER_TYPE.DIGITAL_OCEAN;
							break;
						case "AWSCluster":
							provider = PROVIDER_TYPE.AWS;
							break;
						case "AWSManagedCluster":
							provider = PROVIDER_TYPE.AWS_EKS;
							break;
					}
					result.push({
						name: i.metadata.name,
						provider,
						status: i.status.phase,
					});
				}
			}
		);
		this.clusters = result;
		return result;
	}

	/**
	 * Gets supported providers by management cluster and put them into `supportedProviders`
	 * @returns {Promise<Array<Number>>}	List of {@link PROVIDER_TYPE}.
	 */
	async getSupportedProviders() {
		let kctl = new Kubectl();
		let providers = [];
		await KubeConfig.tempConfig(
			kctl.config,
			this.config.config,
			async () => {
				let pods = await kctl.get("pods", "", {
					outputType: "json",
					allNamespaces: true,
				}); // --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' -A
				for (let i of pods.items) {
					switch (i.metadata.namespace) {
						case "capd-system":
							providers.push(PROVIDER_TYPE.DOCKER);
							break;
						case "capdo-system":
							providers.push(PROVIDER_TYPE.DIGITAL_OCEAN);
							break;
						case "capa-system":
							providers.push(PROVIDER_TYPE.AWS);
							break;
					}
				}
			}
		);
		this.supportedProviders = providers;
		return providers;
	}

	/**
	 * Gets all management clusters.
	 * @returns {Promise<Array<ManagementCluster>>}	List of management cluster those used by KOS.
	 * @static
	 */
	static async getManagementClusters() {
		let dir = await dirCheck(DIRS.managementClusters);
		return new Promise((resolve, reject) => {
			readdir(dir, async (err, files) => {
				if (err) return reject(err);
				let configFiles = files.filter((x) =>
					x.endsWith(".kubeconfig")
				);
				let clusterList = [];
				for (const conf of configFiles) {
					try {
						let manCluster = new ManagementCluster(
							conf.split(".").slice(0, -1).join(".")
						);
						await manCluster.config.changePath(`${dir}/${conf}`);
						await manCluster.getClusters();
						await manCluster.getSupportedProviders();

						clusterList.push(manCluster);
					} catch (err) {
						return reject(err);
					}
				}
				resolve(clusterList);
			});
		});
	}
}
