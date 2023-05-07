import { Fab } from "kos-fe/components/UI/Fab";
import { ReversibleLayoutProvider } from "kos-fe/contexts/ReversibleLayoutContext";
import { useViewModel } from "./viewmodel";
import { ReversibleLayoutProps } from "./types";
import { BaseLayout } from "../BaseLayout";

function ViewContent(props: ReversibleLayoutProps) {
	const viewModel = useViewModel();

	return (
		<BaseLayout>
			<Fab
				onClick={viewModel.goBack}
				disabled={!viewModel.isBackEnabled}
				horizontalAlign="left"
				verticalAlign="top"
				icon="material-symbols:arrow-back-rounded"
			/>
			{props.children}
		</BaseLayout>
	);
}

export function ReversibleLayout(props: ReversibleLayoutProps) {
	return (
		<ReversibleLayoutProvider>
			<ViewContent {...props} />
		</ReversibleLayoutProvider>
	);
}
