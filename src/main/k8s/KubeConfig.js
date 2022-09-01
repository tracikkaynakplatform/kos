import Kubectl from "../services/Kubectl";
import { env, cwd } from "process";
import { execSync } from "child_process";
import fs from "fs";

class KubeConfig {
	constructor() {
		this.config = undefined;
	}

	/**
	 * kubectl'in konumunu döndürür. Eğer kullanılabilir bir kubectl
	 * mevcut değilse Error fırlatır.
	 *
	 * @throws {Error}
	 * @returns {string}
	 */
	#checkKubectl() {
		let path = Kubectl.check();
		if (!!!path) throw new Error("kubectl bulunamadı");
		return path;
	}

	/**
	 * kubectl'i çalıştırır ve çıktısını döndürür.
	 *
	 * @param  {...any} args kubectl'e geçecek argümanlar.
	 * @returns {string}
	 */
	execKube(...args) {
		// TODO: varolmayan dizin kontrolü
		let kubeconfig = cwd() + "/config/kubeconfig";
		let path = this.#checkKubectl();

		fs.writeFileSync(kubeconfig, this.config);
		return execSync(
			`${path} --kubeconfig ${kubeconfig} ${args.join(" ")}`
		).toString();
	}

	/**
	 * KUBECONFIG çevre değişkeninde kayıtlı olan yoldaki dosyayı
	 * kubeconfig dosyası olarak kullanır. Eğer KUBECONFIG çevre
	 * değişkeni atanmamışsa, ~/.kube/config dosyasını kullanma-
	 * yı dener.
	 */
	loadFromDefault() {
		let path = `${env.HOME}/.kube/config`;

		if (env.KUBECONFIG) path = env.KUBECONFIG;
		this.loadFromFile(path);
	}

	/**
	 * Kubeconfig'i dosyadan yükler.
	 *
	 * @param {string} path Kubeconfig yolu.
	 */
	loadFromFile(path) {
		this.config = fs.readFileSync(path).toString();
	}

	/**
	 * Kubeconfig'i string olarak alır.
	 *
	 * @param {string} str Kubeconfig içeriği.
	 */
	loadFromString(str) {
		this.config = str;
	}

	apply(yamlContent) {
		let yamlFile = cwd() + "/config/applyaml.yaml";
		fs.writeFileSync(yamlFile, yamlContent);
		return this.execKube("apply", "-f", yamlFile);
	}

	/**
	 * kubectl get [resourceType] komutunu çalıştırır ve çıktısını
	 * döndürür.
	 *
	 * @param {string} resourceType İstenen kaynak tipini belirtir.
	 * @param {string} outputType Çıktının tipini belirtir. json veya yaml olabilir.
	 * @returns {object} Nesne olarak çıktıyı döndürür.
	 */
	get(resourceType, namespace = "") {
		return JSON.parse(
			this.execKube("get", resourceType, namespace, "-o", "json")
		);
	}
}

export default new KubeConfig();
