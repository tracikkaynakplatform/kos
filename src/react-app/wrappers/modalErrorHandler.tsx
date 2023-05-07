import { MessageModal } from "kos-fe/components/Modals/MessageModal";
import { useModalStore } from "kos-fe/stores/useModalStore";
import { Logger } from "kos-shared/Logger";

export async function modalErrorHandler(wrappedFunction: Function, onError?: Function, callback?: Function) {
	const { openModal } = useModalStore.getState();
	const handleError = (error: any) => {
		openModal(<MessageModal message={error?.message ?? error} title="Error" />);
		Logger.error(error);
		onError?.(handleError);
	};
	try {
		await wrappedFunction?.(handleError);
	} catch (err) {
		handleError(err);
	}
	await callback?.(handleError);
}
