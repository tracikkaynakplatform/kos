import { getTask, removeTask } from "kos-fe/api/task";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { Task, TaskStatus } from "kos-fe/models/Task";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useViewModel() {
	const [status, setStatus] = useState<string>("");
	const [continueBackground, setContinueBackground] = useState<boolean>(false);
	const navigate = useNavigate();
	let interval: NodeJS.Timer;
	let taskInfo: Task | null = null;

	const goToHomepage = () => {
		clearInterval(interval);
		navigate("/management-clusters", { replace: true });
	};

	const checkTaskInfo = async () => {
		if (taskInfo) {
			const taskResponse = await getTask(taskInfo.id);
			if (taskResponse.status == TaskStatus.ErrorOccurred) {
				toast.error(taskResponse.error);

				// Only needed binaries downloaded. Others are optional.
				if (taskResponse.progress > 2) {
					goToHomepage();
				} else {
					taskInfo = await window["osAPI"]["downloadExecutable"]();
				}
				return;
			}

			if (taskResponse.progress > 2 && !continueBackground) {
				setContinueBackground(true);
			}

			if (taskResponse.status == TaskStatus.Finish) {
				await removeTask(taskResponse.id);
				clearInterval(interval);
				navigate("/management-clusters", { replace: true });
			}
			setStatus(taskResponse.message);
		}
	};

	// NOTE: Just for electron application
	useComponentDidMount(() => {
		interval = setInterval(() => checkTaskInfo(), 500);
		modalErrorHandler(async () => {
			taskInfo = await window["osAPI"]["downloadExecutable"]();
			checkTaskInfo();
		});
	});

	return {
		status,
		continueBackground,
		goToHomepage,
	};
}
