import React from "react";
import { useSnackbar } from "notistack";

export function useCustomSnackbar() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	return {
		enqueueSnackbar: (
			message,
			options,
			SnackbarComponent,
			additionalProps
		) =>
			enqueueSnackbar(message, {
				content: !!SnackbarComponent
					? (key, message) => (
							<SnackbarComponent
								key={key}
								message={message}
								{...additionalProps}
							/>
					  )
					: undefined,
				...options,
			}),
		closeSnackbar,
	};
}
