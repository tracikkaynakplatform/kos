import { logger } from "./logger";

export async function handleErrorWithSnack(snack, func, onError, callback) {
	try {
		await func?.();
	} catch (err) {
		logger.error(err.message);
		snack("Bir hata oluştu. " + err.message.slice(0, 200) + "...", {
			variant: "error",
			autoHideDuration: 4000,
		});
		await onError?.();
	}
	await callback?.();
}
