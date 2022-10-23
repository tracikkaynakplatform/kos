const { env } = require("process");

module.exports = {
	presets: [
		//TODO: cannot use import in tests, but browser code gives module exceptions
		//  when below is disabled
		//  eg: Uncaught ReferenceError: exports is not defined
		// ['@babel/preset-env', {"targets": {"node":true}}],
		[
			"@babel/preset-env",
			{
				targets: { node: true },
				modules: env.NODE_ENV === "test" ? undefined : false,
			},
		],
	],
};
