import { Transition } from "@headlessui/react";
import { TextField } from "kos-fe/components/UI";
import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputTextFieldProps } from "./types";

export function InputTextField({ name, defaultValue, ...props }: InputTextFieldProps) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue ?? ""}
			render={({ field, fieldState: { error } }) => (
				<div className="flex flex-col gap-2">
					<TextField {...field} {...props} />
					<Transition
						show={!!error}
						as={Fragment}
						enter="transition-all duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-all duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="text-red-500 font-bold italic">{error?.message}</div>
					</Transition>
				</div>
			)}
		/>
	);
}
