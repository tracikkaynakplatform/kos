export class Logger {
	public static log(...args: any[]) {
		console.log(`${new Date(Date.now()).toLocaleTimeString()}: [LOG]:`, ...args);
	}

	public static debug(...args: any[]) {
		this.log(...args);
	}

	public static error(...args: any[] | Error[]) {
		args = args.map((arg: any | Error) => {
			if (arg instanceof Error) {
				return `${arg.name}: ${arg.message} ${arg.stack}`;
			}
			return arg;
		});
		console.error(`${new Date(Date.now()).toLocaleTimeString()}: [ERROR]:`, ...args);
	}
}
