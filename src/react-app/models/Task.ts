export enum TaskStatus {
	Running = "running",
	Paused = "paused",
	Canceled = "canceled",
	Finish = "finish",
	ErrorOccurred = "error",
}

export interface Task {
	id: string;
	status: TaskStatus;
	message: string;
	progress: number;
	finishProgress: number;
	value: any;
	error: any;
	description: string;
}
