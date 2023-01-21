import { logger } from "../logger";

export class Task {
	constructor(steps, status = "") {
		this.steps = steps;
		this.status = status;

		this.reset();
	}

	reset() {
		this.value = undefined;
		this.done = false;
		this.canceled = false;
		this.finish = false;
		this.error = undefined;
	}

	cancel() {
		this.canceled = true;
	}

	async run() {
		this.reset();
		const values = [];

		for (const step of this.steps) {
			if (this.canceled) break;

			try {
				this.value = await step(this, values);
				values.push(this.value);
			} catch (err) {
				logger.error(err);
				this.done = false;
				this.finish = true;
				this.error = err;
				this.cancel();
				return;
			}
		}
		this.done = true;
		this.finish = true;
	}

	changeStatus(newStatus) {
		this.status = newStatus;
	}
}
