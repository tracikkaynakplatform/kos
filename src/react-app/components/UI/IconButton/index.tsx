import { Icon } from "@iconify/react";
import { IconButtonProps } from "./type";

export function IconButton({ icon, iconProps, side, className, children, ...props }: IconButtonProps) {
	return (
		<button className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""} ${className}`} {...props}>
			<Icon {...iconProps} fontSize="20px" icon={icon} />
			{children}
		</button>
	);
}
