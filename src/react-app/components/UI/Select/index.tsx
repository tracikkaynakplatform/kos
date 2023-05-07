import { Listbox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Fragment, forwardRef } from "react";
import { SelectProps } from "./types";

export const Select = forwardRef<HTMLDivElement, SelectProps>((props: SelectProps, ref) => (
	<div ref={ref} className="flex flex-col w-full">
		{props.label ? <label className="text-gray-600 dark:text-gray-400">{props.label}</label> : null}
		<Listbox defaultValue={props.defaultValue} value={props.value ?? null} onChange={props.onChange}>
			<div className="relative w-full">
				<Listbox.Button className="hover:cursor-pointer hover:bg-gray-300 w-full rounded-lg py-2 pl-3 pr-10 bg-gray-200 dark:bg-gray-500 text-left shadow-md focus:outline-none flex gap-3 items-center text-gray-700 dark:text-white">
					{props.isLoading ? (
						<>
							<Icon icon="eos-icons:loading" />
							<div className="h-5">Loading...</div>
						</>
					) : (
						<>
							{props.value?.icon && <Icon icon={props.value?.icon} />}
							<div className=" h-5">{props.value?.label}</div>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2">
								<Icon icon="mdi:chevron-up-down" className="h-5 w-5" />
							</span>
						</>
					)}
				</Listbox.Button>
				<Transition
					as={Fragment}
					enter="transition ease-in duration-100"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto h-fit rounded-md bg-gray-300 dark:bg-gray-500 py-1 z-50 shadow-lg focus:outline-none ">
						{props.options?.length > 0 ? (
							props.options.map((option, index) => (
								<Listbox.Option
									key={index}
									className="relative hover:cursor-pointer hover:bg-gray-300 hover:text-gray-700 select-none py-2 pl-10 pr-4 text-black dark:text-white"
									value={option}
								>
									<div className="flex gap-3 items-center">
										{option.icon && <Icon icon={option.icon} />}
										<span className={`${option.id === props.value?.id ? "font-medium" : "font-normal"}`}>
											{option.label}
										</span>
										{option.id === props.value?.id ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-white">
												<Icon icon="octicon:dot-fill-16" className="h-5 w-5" />
											</span>
										) : null}
									</div>
								</Listbox.Option>
							))
						) : (
							<div className="relative hover:cursor-pointer hover:bg-gray-400 hover:text-gray-700 select-none py-2 pl-10 pr-4 text-white">
								There is no option
							</div>
						)}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	</div>
));
