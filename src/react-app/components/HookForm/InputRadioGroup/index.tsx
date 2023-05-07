import { Controller } from "react-hook-form";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { InputRadioGroupProps } from "./types";
import { useViewModel } from "./viewmodel";

export function InputRadioGroup(props: InputRadioGroupProps) {
	const { control, handleChange } = useViewModel(props);

	return (
		<Controller
			name={props.name}
			control={control}
			defaultValue={props.options?.find((option) => option.checked)?.value}
			render={({ field: { onChange: setField, value }, fieldState: { error } }) => (
				<div className="flex flex-col gap-2 p-2">
					{props.label ? <label className="text-gray-400">{props.label}</label> : null}

					<div className="flex gap-5 flex-wrap">
						{props.options.map((option, index) => (
							<div key={index} className="flex gap-2 items-center">
								<input
									id={`${option.value}:${index}`}
									className="h-4 w-4"
									name={props.name}
									type="radio"
									onChange={(e) => handleChange(e.target.value, setField)}
									value={option.value}
									defaultChecked={option.checked}
								/>
								<label htmlFor={`${option.value}:${index}`} className="text-gray-300">
									{option.label}
								</label>
							</div>
						))}
					</div>
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
