import { forwardRef } from "react";
import { TextFieldProps } from "./types";

export const TextField = forwardRef<HTMLInputElement & HTMLTextAreaElement, TextFieldProps>((props: TextFieldProps, ref) => {
	const classes =
		"font-mono border-2 border-gray-200 dark:border-gray-700 focus-visible:outline-none p-2 bg-gray-100 dark:bg-gray-500 rounded-lg text-gray-800 dark:text-white w-full resize-none h-fit shadow-lg";
	return (
		<div className="flex flex-col w-full">
			{props.label ? <label className="text-gray-600 dark:text-gray-400">{props.label}</label> : null}
			{props.rows ? (
				<textarea
					onBlur={props.onBlur}
					ref={ref}
					name={props.name}
					value={props.value}
					className={classes}
					cols={props.cols}
					rows={props.rows}
					style={props.style}
					onChange={props.onChange}
					defaultValue={props.defaultValue}
				/>
			) : (
				<input
					ref={ref}
					onBlur={props.onBlur}
					onChange={props.onChange}
					defaultValue={props.defaultValue}
					value={props.value}
					style={props.style}
					className={classes}
					type={props.type}
				/>
			)}
		</div>
	);
});
