import React, { forwardRef } from "react";

const Button = forwardRef(({ children, className, ...props }, ref) => {
	return (
		<button
			className={`bg-baltic-500 font-bold p-2 rounded-md shadow-xl text-white transition-all duration-200 hover:bg-baltic-600 active:bg-baltic-700 ${className}`}
			ref={ref}
			{...props}
		>
			{children}
		</button>
	);
});

export default Button;
