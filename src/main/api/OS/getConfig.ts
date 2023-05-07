import { Directories, Environment } from "kos/service/Environment";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { defaultConfiguration } from "kos/constants/DefaultConfiguration";
import { jsonPath } from "kos/utils/jsonPath";

export async function getConfig(query: string): Promise<any> {
	const configFile = new JSONFile(join(Environment.checkDirectory(Directories.Config), "kos.json"));
	const db = new Low(configFile, defaultConfiguration);
	await db.read();
	return jsonPath(db.data, query);
}
