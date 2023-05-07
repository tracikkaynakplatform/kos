import { CircularProgress } from "kos-fe/components/UI";

export type LoadingModalProps = {
	title?: string;
};

export function View(props: LoadingModalProps) {
	return (
		<div className="flex flex-col gap-5 w-full">
			{!!props.title && <div className="font-bold text-xl">{props.title}</div>}
			<div className="flex items-center justify-center">
				<div className="w-16 h-16">
					<CircularProgress />
				</div>
			</div>
		</div>
	);
}
