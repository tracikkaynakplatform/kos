import { ReversibleLayout } from "kos-fe/layout";
import { UpgradeCluster } from "kos-fe/wizards";

export function UpgradeClusterPage() {
	return (
		<ReversibleLayout>
			<div className="h-screen w-full flex items-center justify-center">
				<UpgradeCluster />
			</div>
		</ReversibleLayout>
	);
}
