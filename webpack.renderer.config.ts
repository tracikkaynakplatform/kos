import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

export const rendererConfig: Configuration = {
	module: {
		rules,
	},
	plugins,
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
		alias: {
			kos: path.resolve(__dirname, "src/main/"),
			"kos-fe": path.resolve(__dirname, "src/react-app/"),
			"kos-shared": path.resolve(__dirname, "src/shared"),
			lib: path.resolve(__dirname, "src/react-app/lib"),
		},
	},
};
