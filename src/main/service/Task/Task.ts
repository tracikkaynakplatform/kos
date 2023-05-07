import { Logger } from "kos-shared/Logger";
import { nanoid } from "nanoid";

export enum TaskStatus {
	Running = "running",
	Paused = "paused",
	Canceled = "canceled",
	Finish = "finish",
	ErrorOccurred = "error",
}

export abstract class Task {
	public id: string = nanoid(5);
	public message: string = "";
	public description: string = "";
	public status: TaskStatus = TaskStatus.Paused;
	public value: any = null;
	public finishProgress: number = 1;
	public error: any = null;

	private _progress: number = 1;
	public get progress(): number {
		return this._progress;
	}
	public set progress(value: number) {
		this._progress = value;
		if (this._progress == this.finishProgress) {
			this.status = TaskStatus.Finish;
		}
	}

	protected controller: AbortController = new AbortController();

	public constructor(finishProgress: number) {
		this.finishProgress = finishProgress;
	}

	protected abstract operate(): Promise<any>;

	public async run() {
		this.status = TaskStatus.Running;
		try {
			await this.operate();
		} catch (err) {
			if (this.status == TaskStatus.Canceled) {
				return;
			}
			Logger.error(err);
			this.status = TaskStatus.ErrorOccurred;
			this.error = err?.message ?? err;
		}
	}

	public toPlainObject() {
		return {
			id: this.id,
			status: this.status,
			message: this.message,
			progress: this.progress,
			finishProgress: this.finishProgress,
			value: this.value,
			error: this.error,
			description: this.description,
		};
	}

	public abort() {
		this.status = TaskStatus.Canceled;
		this.controller.abort();
	}
}
