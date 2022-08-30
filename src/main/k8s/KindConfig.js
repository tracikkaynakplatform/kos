import { execSync, spawn } from 'child_process';
import Kind from '../services/Kind';

export const KindSteps = {
	/* Küme oluşturma adımları */
	ENSURE_IMAGES: 'Ensuring node image',
	PREPARE_NODES: 'Preparing nodes',
	WRITE_CONFIG: 'Writing configuration',
	START_CONTROL_PLANE: 'Starting control-plane',
	INSTALL_CNI: 'Installing CNI',
	INSTALL_STORAGE: 'Installing StorageClass',
	FINISH_CREATE_CLUSTER: 'You can now use your cluster with'
}

class KindConfig {
	constructor() {
		this.config = undefined;
	}

	/**
	 * kind'ın konumunu döndürür. Eğer kullanılabilir bir kind
	 * mevcut değilse Error fırlatır.
	 *  
	 * @throws {Error}
	 * @returns {string}
	 */
	#checkKind() {
		let path = Kind.check();
		if (!!!path)
			throw new Error('kind bulunamadı');
		return (path);
	}

	async createCluster(name, onProgressCallback) {
		return new Promise((resolve, reject) => {
			const kind = spawn(this.#checkKind(), ['create', 'cluster', '--name', name]);
			kind.on('exit', (code) => resolve(code));
			kind.stderr.on('data', (data) => {
				let status = '';
				data = data.toString();
				if (data.includes(KindSteps.ENSURE_IMAGES))
					status = KindSteps.ENSURE_IMAGES;
				else if (data.includes(KindSteps.PREPARE_NODES))
					status = KindSteps.PREPARE_NODES;
				else if (data.includes(KindSteps.WRITE_CONFIG))
					status = KindSteps.WRITE_CONFIG;
				else if (data.includes(KindSteps.START_CONTROL_PLANE))
					status = KindSteps.START_CONTROL_PLANE;
				else if (data.includes(KindSteps.INSTALL_CNI))
					status = KindSteps.INSTALL_CNI;
				else if (data.includes(KindSteps.INSTALL_STORAGE))
					status = KindSteps.INSTALL_STORAGE;
				else if (data.includes(KindSteps.FINISH_CREATE_CLUSTER))
					status = KindSteps.FINISH_CREATE_CLUSTER;
				onProgressCallback(status);
			});
		});
	}
}

export default new KindConfig();