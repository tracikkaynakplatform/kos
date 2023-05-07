import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import path from "path";

export const mainConfig: Configuration = {
	entry: "./src/main/index.ts",
	module: {
		rules,
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
		alias: {
			kos: path.resolve(__dirname, "src/main/"),
			"kos-fe": path.resolve(__dirname, "src/react-app/"),
			"kos-shared": path.resolve(__dirname, "src/shared"),
			lib: path.resolve(__dirname, "src/react-app/lib"),
		},
	},
};
