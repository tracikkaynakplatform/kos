import { BaseLayoutProps } from "./types";
import { useViewModel } from "./viewmodel";

export function BaseLayout(props: BaseLayoutProps) {
	const { theme } = useViewModel();

	return <div data-mode={theme}>{props.children}</div>;
}
