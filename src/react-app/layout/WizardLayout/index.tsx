import { ReversibleLayout } from "../ReversibleLayout";
import { WizardLayoutProps } from "./types";

export function WizardLayout(props: WizardLayoutProps) {
	return (
		<ReversibleLayout>
			<div className="h-screen w-full flex items-center justify-center bg-white dark:bg-dark">{props.children}</div>
		</ReversibleLayout>
	);
}
