import { API } from "kos/api/types";
import { exportAPI } from "kos/api/exportAPI";
import { getTask } from "./getTask";
import { removeTask } from "./removeTask";
import { abortTask } from "./abortTask";

const api: API = {
	namespace: "taskAPI",
	functions: [exportAPI("getTask", getTask), exportAPI("removeTask", removeTask), exportAPI("abortTask", abortTask)],
};

export default api;
