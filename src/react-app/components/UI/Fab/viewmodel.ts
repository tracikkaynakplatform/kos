import { HorizontalAlign, VerticalAlign } from ".";

export function useViewModel(horizontalAlign: HorizontalAlign, verticalAlign: VerticalAlign) {
	let rightSpace, leftSpace, topSpace, bottomSpace;

	switch (horizontalAlign) {
		case "left":
			leftSpace = "10px";
			break;
		case "center":
			leftSpace = "50%";
			break;
		case "right":
			rightSpace = "10px";
			break;
	}

	switch (verticalAlign) {
		case "bottom":
			bottomSpace = "10px";
			break;
		case "center":
			topSpace = "50%";
			break;
		case "top":
			topSpace = "10px";
			break;
	}

	return {
		rightSpace,
		leftSpace,
		topSpace,
		bottomSpace,
	};
}
