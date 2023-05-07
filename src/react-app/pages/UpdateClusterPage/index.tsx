import { ReversibleLayout } from "kos-fe/layout";
import { UpdateCluster } from "kos-fe/wizards/UpdateCluster";

export function UpdateClusterPage() {
	return (
		<ReversibleLayout>
			<div className="h-screen w-full flex items-center justify-center">
				<UpdateCluster />
			</div>
		</ReversibleLayout>
	);
}
