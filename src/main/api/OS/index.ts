import { API } from "kos/api/types";
import { exportAPI } from "../exportAPI";
import { getDefaultKubeconfig } from "./getDefaultKubeconfig";
import { downloadExecutable } from "./downloadExecutable";
import { getCurrentContext } from "./getCurrentContext";
import { getConfig } from "./getConfig";
import { setConfig } from "./setConfig";

const api: API = {
	namespace: "osAPI",
	functions: [
		exportAPI("getDefaultKubeconfig", getDefaultKubeconfig),
		exportAPI("downloadExecutable", downloadExecutable),
		exportAPI("getCurrentContext", getCurrentContext),
		exportAPI("getConfig", getConfig),
		exportAPI("setConfig", setConfig),
	],
};

export default api;
