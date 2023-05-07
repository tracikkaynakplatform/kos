import { CSSProperties, ReactNode } from "react";

export type HorizontalAlign = "left" | "right" | "center";
export type VerticalAlign = "top" | "bottom" | "center";
export interface FabProps {
	children?: ReactNode;
	style?: CSSProperties;
	icon?: string;
	horizontalAlign: HorizontalAlign;
	verticalAlign: VerticalAlign;
	disabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
