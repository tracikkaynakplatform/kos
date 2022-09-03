import Downloader from "./base/Downloader";

class Kind extends Downloader {
	constructor() {
		const url =
			"htpps://api.github.com/repos/kubernetes-sigs/kind/releases/latest";
		const name = "kind";
		super(url, name);
	}
}

export default new Kind();
