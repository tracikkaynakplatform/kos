import React, { forwardRef } from "react";
import classNames from "classnames";

export const BUTTON_COLOR = {
	error: {
		enabled: "bg-red-500 hover:bg-red-600 active:bg-red-700",
		disabled: "bg-red-500",
	},
	primary: {
		enabled: "bg-baltic-500 hover:bg-baltic-600 active:bg-baltic-700",
		disabled: "bg-baltic-500",
	},
};

export const Button = forwardRef(
	({ children, className, variant, disabled, color, ...props }, ref) => {
		if (!!!color) color = BUTTON_COLOR.primary;
		return (
			<button
				className={
					"font-bold p-2 shadow-xl text-white transition-all duration-200 " +
					classNames(
						{
							"rounded-full": variant === "fab",
							"rounded-md": variant !== "fab",
							"w-[50px]": variant === "fab",
							"h-[50px]": variant === "fab",
							"cursor-not-allowed opacity-60": !!disabled,
							[color.enabled]: !!!disabled,
							[color.disabled]: !!disabled,
						},
						className
					)
				}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	}
);

export default Button;
