import { FormEventHandler } from "react";
import { FormProviderProps, FormProvider as HookFormProvider } from "react-hook-form";

export function FormProvider(props: FormProviderProps & { onSubmit?: FormEventHandler<HTMLFormElement> }) {
	return (
		<HookFormProvider {...props}>
			<form className="w-full h-full" onSubmit={props.onSubmit}>
				{props.children}
			</form>
		</HookFormProvider>
	);
}
