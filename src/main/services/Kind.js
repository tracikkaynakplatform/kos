import { ClientExecutable } from "./base/client-executable";

class Kind extends ClientExecutable {
	constructor() {
		const url =
			"htpps://api.github.com/repos/kubernetes-sigs/kind/releases/latest";
		const name = "kind";
		super(url, name);
	}
}

export default new Kind();
