import { Select } from "kos-fe/components/UI/Select";
import { Controller } from "react-hook-form";
import { useViewModel } from "./viewmodel";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { InputSelectProps } from "./types";

export function InputSelect({ defaultValue, ...props }: InputSelectProps) {
	const { control } = useViewModel(props);

	return (
		<Controller
			name={props.name}
			control={control}
			defaultValue={defaultValue ?? props.options?.[0]}
			render={({ field, fieldState: { error } }) => (
				<div className="flex flex-col gap-2">
					<Select {...field} {...props} />
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
						<div className="text-red-500 font-bold italic">{error?.message ?? error?.value.message}</div>
					</Transition>
				</div>
			)}
		/>
	);
}
