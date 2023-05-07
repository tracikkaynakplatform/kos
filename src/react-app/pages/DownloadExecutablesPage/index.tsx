import { CircularProgress } from "kos-fe/components/UI";
import { useViewModel } from "./viewmodel";

export function DownloadExecutablesPage() {
	const viewModel = useViewModel();

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="w-[450px] h-fit flex  flex-col p-4 shadow-xl rounded-lg border-2 border-gray-100">
				<div className="text-xl font-bold pb-4 pt-4">Download executables</div>
				<div>
					KOS downloading necessary executable files. These are: kubectl, clusterctl and aws-cli
					<br />
					<br />
					<div className="font-bold italic">{viewModel.status}</div>
				</div>
				<div className="justify-center mt-3 mb-3 flex gap-3 w-full">
					<div className="w-[100px] h-[100px]">
						<CircularProgress />
					</div>
				</div>

				{viewModel.continueBackground ? (
					<button className="w-fit" onClick={viewModel.goToHomepage}>
						Continue at background
					</button>
				) : null}
			</div>
		</div>
	);
}
