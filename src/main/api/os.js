import { shell } from "electron";
import { exportHelper } from "./exportHelper";

export async function openLink(link) {
	shell.openExternal(link);
}

export default [exportHelper("openLink", openLink)];
