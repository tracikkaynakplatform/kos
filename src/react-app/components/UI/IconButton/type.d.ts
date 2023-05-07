import { IconProps } from "@iconify/react";
import { ButtonHTMLAttributes } from "react";

export type IconSide = "left" | "right";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: string;
	side?: IconSide;
	iconProps?: IconProps;
}
