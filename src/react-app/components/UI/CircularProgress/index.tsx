import { useViewModel } from "./viewmodel";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { CircularProgressProps } from "./types";
import "react-circular-progressbar/dist/styles.css";

// https://codesandbox.io/s/mqqq8r0kk8?file=/index.js:340-1303
export function CircularProgress(props: CircularProgressProps = { color: "gray" }) {
	const viewModel = useViewModel();
	return (
		<CircularProgressbarWithChildren
			className="rotating"
			value={viewModel.value}
			styles={{
				path: {
					stroke: props.color,
					transition: "stroke-dashoffset 2s ease 0s",
				},
				trail: {
					stroke: "#fff",
				},
			}}
			strokeWidth={8}
		>
			<div className="text-xl font-bold text-black dark:text-white">{props.text}</div>
		</CircularProgressbarWithChildren>
	);
}
